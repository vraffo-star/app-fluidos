// Marcação e comportamento de uma pergunta, usados em Estudar e em Revisar.
import * as store from '../store.js';
import { unidade } from '../dados.js';
import { esc, rico, corSegura } from '../util.js';

const LETRAS = 'ABCDEFGHIJ';
export const DIFICULDADE = { 1: 'Fácil', 2: 'Média', 3: 'Para pensar' };

export function htmlMeta(q) {
  const u = unidade(q.unidade);
  const d = DIFICULDADE[q.dificuldade] ? q.dificuldade : 2;
  return `
    <div class="p-meta">
      <span class="chip" style="--cor:${corSegura(u?.cor)}">${esc(u?.curto || q.unidade)}</span>
      <span class="p-tema">${esc(q.tema)}</span>
      <span class="selo dif-${d}"><i></i><i></i><i></i>${DIFICULDADE[d]}</span>
    </div>`;
}

export function htmlEnunciado(q) {
  const afirmativas = Array.isArray(q.afirmativas) && q.afirmativas.length
    ? `<ul class="afirmativas">${q.afirmativas.map((a) => `<li>${rico(a)}</li>`).join('')}</ul>`
    : '';
  return `
    ${q.tipo === 'incorreta' ? '<p class="p-aviso">Procure a alternativa <strong>incorreta</strong></p>' : ''}
    <h1 class="p-enunciado">${rico(q.enunciado)}</h1>
    ${afirmativas}`;
}

function letra(q, i) {
  return q.tipo === 'vf' ? q.alternativas[i].charAt(0).toUpperCase() : LETRAS[i] || String(i + 1);
}

// `escolha` nulo = ainda não respondida. Respondida: marca a correta (✓) e a escolhida errada (✗).
// `selecionavel` (simulado): só destaca a escolhida, sem revelar a correta, e continua tocável.
export function htmlAlternativas(q, escolha = null, selecionavel = false) {
  const respondida = escolha !== null && !selecionavel;
  const botoes = q.alternativas.map((texto, i) => {
    let classe = '';
    let marca = letra(q, i);
    let leitor = '';
    let atributos = respondida ? ' disabled' : '';
    if (selecionavel) {
      atributos = ` aria-pressed="${i === escolha}"`;
      if (i === escolha) classe = ' escolhida';
    } else if (respondida && i === q.correta) {
      classe = ' certa';
      marca = '✓';
      leitor = '<span class="so-leitor"> (correta)</span>';
    } else if (respondida && i === escolha) {
      classe = ' errada';
      marca = '✗';
      leitor = '<span class="so-leitor"> (sua resposta, incorreta)</span>';
    }
    return `
      <button type="button" class="alt${classe}" data-i="${i}"${atributos}>
        <span class="alt-letra" aria-hidden="true">${marca}</span>
        <span class="alt-texto">${rico(texto)}${leitor}</span>
      </button>`;
  }).join('');
  return `<div class="alts" role="group" aria-label="Alternativas">${botoes}</div>`;
}

export function htmlExplicacao(q, escolha, nota = '') {
  const acertou = escolha === q.correta;
  return `
    <section class="explica ${acertou ? 'ok' : 'erro'}" aria-live="polite">
      <h2>${acertou ? '✓ Você acertou' : '✗ Você errou'}</h2>
      <p>${rico(q.explicacao)}</p>
      ${nota ? `<p class="explica-nota">${esc(nota)}</p>` : ''}
    </section>`;
}

// Pergunta já respondida em formato compacto (listas de resultado). `escolha` nulo = sem resposta.
export function htmlItemRespondido(q, escolha) {
  const semResposta = escolha === null || escolha === undefined;
  const acertou = escolha === q.correta;
  return `
    ${htmlMeta(q)}
    ${htmlEnunciado(q)}
    ${acertou ? '' : `<p class="linha-resp erro"><span aria-hidden="true">${semResposta ? '—' : '✗'}</span> <span><b>Sua resposta:</b> ${semResposta ? 'sem resposta' : rico(q.alternativas[escolha])}</span></p>`}
    <p class="linha-resp ok"><span aria-hidden="true">✓</span> <span><b>Correta:</b> ${rico(q.alternativas[q.correta])}</span></p>
    <p class="errada-explica">${rico(q.explicacao)}</p>`;
}

export function htmlEstrela(id) {
  const fav = store.favorita(id);
  return `<button type="button" class="estrela" id="fav" aria-pressed="${fav}" aria-label="Favoritar pergunta">${fav ? '★' : '☆'}</button>`;
}

export function ligarEstrela(raiz, id) {
  raiz.querySelector('#fav')?.addEventListener('click', (e) => {
    const agora = store.alternarFavorita(id);
    e.currentTarget.setAttribute('aria-pressed', agora);
    e.currentTarget.textContent = agora ? '★' : '☆';
  });
}

// Tela de uma pergunta com resposta imediata.
// op: {
//   q, escolha (índice já dado, ou nulo),
//   progresso: { atual, total }  ou  voltar: { href, rotulo },
//   proxima: rótulo do botão que aparece depois de responder,
//   aoResponder(i, acertou) → texto opcional mostrado junto da explicação,
//   aoProxima()
// }
export function telaPergunta(raiz, op) {
  const { q } = op;
  let nota = op.nota || '';

  function desenhar(escolha) {
    const respondida = escolha !== null;
    const p = op.progresso;
    const topo = p
      ? `<div class="barra" role="progressbar" aria-valuemin="0" aria-valuemax="${p.total}" aria-valuenow="${p.atual}" aria-label="Progresso">
           <span style="width:${((p.atual - 1 + (respondida ? 1 : 0)) / p.total) * 100}%"></span>
         </div>
         <span class="num sessao-conta">${p.atual}/${p.total}</span>`
      : `<a class="voltar" href="${esc(op.voltar.href)}">‹ ${esc(op.voltar.rotulo)}</a>`;

    raiz.innerHTML = `
      <div class="sessao-topo">${topo}${htmlEstrela(q.id)}</div>
      <article class="pergunta">
        ${htmlMeta(q)}
        ${htmlEnunciado(q)}
        ${htmlAlternativas(q, escolha)}
        ${respondida ? htmlExplicacao(q, escolha, nota) : ''}
      </article>
      ${respondida ? `
        <div class="acao-fixa">
          <button class="btn primario grande" type="button" id="proxima">${esc(op.proxima)}</button>
        </div>` : ''}`;

    ligarEstrela(raiz, q.id);

    if (!respondida) {
      raiz.querySelector('.alts').addEventListener('click', (e) => {
        const botao = e.target.closest('.alt');
        if (!botao) return;
        const i = Number(botao.dataset.i);
        nota = op.aoResponder(i, i === q.correta) || '';
        desenhar(i);
        raiz.querySelector('.explica')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
      return;
    }
    raiz.querySelector('#proxima').addEventListener('click', op.aoProxima);
  }

  desenhar(op.escolha ?? null);
}
