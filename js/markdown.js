// Renderizador mínimo dos resumos. Cobre só o que os arquivos de data/resumos usam:
// #, ##, ###, parágrafos, listas (- e 1., com níveis), **negrito**, *itálico*, tabelas simples,
// citações > (caixa de destaque 💡) e ---. Todo o resto é texto puro, sempre escapado.
import { esc } from './util.js';

const RE_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
const RE_TITULO = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const RE_LINHA = /^\s*(-{3,}|\*{3,}|_{3,})\s*$/;
const RE_CITA = /^\s*>/;
const RE_TABELA = /^\s*\|/;

function emLinha(texto) {
  return esc(texto)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?=\S)([^*]+?)\*(?!\*)/g, '$1<em>$2</em>');
}

function slug(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/\*/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'secao';
}

function celulas(linha) {
  return linha.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/)
    .map((c) => c.trim().replace(/\\\|/g, '|'));
}

function tabela(linhas) {
  const filas = linhas.map(celulas);
  const temCabecalho = filas.length > 1 && filas[1].every((c) => /^:?-+:?$/.test(c));
  const lado = temCabecalho
    ? filas[1].map((c) => (c.startsWith(':') && c.endsWith(':') ? 'center' : c.endsWith(':') ? 'right' : ''))
    : [];
  const estilo = (i) => (lado[i] ? ` style="text-align:${lado[i]}"` : '');
  const corpo = filas.slice(temCabecalho ? 2 : 0)
    .map((f) => `<tr>${f.map((c, i) => `<td${estilo(i)}>${emLinha(c)}</td>`).join('')}</tr>`).join('');
  const cabeca = temCabecalho
    ? `<thead><tr>${filas[0].map((c, i) => `<th scope="col"${estilo(i)}>${emLinha(c)}</th>`).join('')}</tr></thead>`
    : '';
  return `<div class="tabela-rolagem" tabindex="0" role="group" aria-label="Tabela"><table>${cabeca}<tbody>${corpo}</tbody></table></div>`;
}

// itens: [{ recuo, ordenada, inicio, texto }]. O recuo maior que o do item anterior abre uma sublista dentro dele.
function lista(itens) {
  let pos = 0;
  function nivel(recuo) {
    const { ordenada, inicio } = itens[pos];
    const marca = ordenada ? 'ol' : 'ul';
    let html = ordenada && inicio !== 1 ? `<ol start="${inicio}">` : `<${marca}>`;
    while (pos < itens.length && itens[pos].recuo >= recuo) {
      html += `<li>${emLinha(itens[pos++].texto)}`;
      if (pos < itens.length && itens[pos].recuo > recuo) html += nivel(itens[pos].recuo);
      html += '</li>';
    }
    return `${html}</${marca}>`;
  }
  let html = '';
  while (pos < itens.length) html += nivel(itens[pos].recuo);
  return html;
}

// Devolve { html, titulos }. `titulos` lista os ## e ### com o id usado como âncora.
// `linkAncora(id)` monta o href do link "#" ao lado de cada título.
export function renderizar(md, linkAncora = (id) => `#${id}`) {
  const linhas = String(md).replace(/\r\n?/g, '\n').split('\n');
  const partes = [];
  const titulos = [];
  const usados = new Set();
  let i = 0;

  const comecaBloco = (l) => RE_TITULO.test(l) || RE_LINHA.test(l) || RE_CITA.test(l) || RE_TABELA.test(l) || RE_ITEM.test(l);

  while (i < linhas.length) {
    const l = linhas[i];
    if (!l.trim()) { i++; continue; }

    const t = l.match(RE_TITULO);
    if (t) {
      const n = Math.min(t[1].length, 3);
      if (n === 1) partes.push(`<h1>${emLinha(t[2])}</h1>`);
      else {
        let id = slug(t[2]);
        for (let k = 2; usados.has(id); k++) id = `${slug(t[2])}-${k}`;
        usados.add(id);
        titulos.push({ nivel: n, texto: t[2].replace(/\*/g, ''), id });
        partes.push(`<h${n} id="${id}">${emLinha(t[2])} <a class="ancora" href="${esc(linkAncora(id))}" aria-label="Link para esta seção">#</a></h${n}>`);
      }
      i++;
      continue;
    }

    if (RE_LINHA.test(l)) { partes.push('<hr>'); i++; continue; }

    if (RE_CITA.test(l)) {
      const texto = [];
      for (; i < linhas.length && RE_CITA.test(linhas[i]); i++) {
        const limpa = linhas[i].replace(/^\s*>\s?/, '').trim();
        if (limpa) texto.push(limpa);
      }
      // A lâmpada é posta pela caixa; se o texto já trouxer uma, não repete.
      if (texto.length) texto[0] = texto[0].replace(/^💡\s*/u, '');
      partes.push(`<aside class="destaque"><span class="destaque-icone" aria-hidden="true">💡</span><p>${texto.map(emLinha).join('<br>')}</p></aside>`);
      continue;
    }

    if (RE_TABELA.test(l)) {
      const bloco = [];
      for (; i < linhas.length && RE_TABELA.test(linhas[i]); i++) bloco.push(linhas[i]);
      partes.push(tabela(bloco));
      continue;
    }

    if (RE_ITEM.test(l)) {
      const itens = [];
      for (; i < linhas.length && linhas[i].trim(); i++) {
        const m = linhas[i].match(RE_ITEM);
        if (m) {
          itens.push({ recuo: m[1].replace(/\t/g, '    ').length, ordenada: /\d/.test(m[2]), inicio: parseInt(m[2], 10) || 1, texto: m[3] });
        } else if (/^\s/.test(linhas[i])) {
          itens[itens.length - 1].texto += ` ${linhas[i].trim()}`; // continuação do item anterior
        } else break;
      }
      partes.push(lista(itens));
      continue;
    }

    const par = [];
    for (; i < linhas.length && linhas[i].trim() && (!par.length || !comecaBloco(linhas[i])); i++) par.push(linhas[i].trim());
    partes.push(`<p>${par.map(emLinha).join('<br>')}</p>`);
  }

  return { html: partes.join('\n'), titulos };
}
