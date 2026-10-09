// Aba Resumos: lista de unidades e leitura do resumo de cada uma.
import * as store from '../store.js';
import { listaUnidades, unidade, carregarResumo } from '../dados.js';
import { esc, corSegura, plural } from '../util.js';
import { renderizar } from '../markdown.js';
import { definirFiltro } from '../revisao.js';

const TAMANHOS = [15, 17, 19, 21, 23];
const PADRAO = 17;

function tamanhoAtual() {
  const salvo = store.pref('fonteResumo', PADRAO);
  return TAMANHOS.includes(salvo) ? salvo : PADRAO;
}

export function telaResumos(raiz, partes) {
  const u = partes[0] && unidade(partes[0]);
  if (partes[0] && !u) {
    location.replace('#/resumos');
    return undefined;
  }
  return u ? leitura(raiz, u, partes[1]) : lista(raiz);
}

function lista(raiz) {
  raiz.innerHTML = `
    <header class="cabeca">
      <p class="rotulo">Resumos</p>
      <h1>Resumo de cada unidade</h1>
    </header>
    <ul class="menu">
      ${listaUnidades().map((u) => `
        <li>
          <a class="menu-item com-cor" href="#/resumos/${encodeURIComponent(u.id)}" style="--cor:${corSegura(u.cor)}">
            <span class="menu-texto">
              <b>${esc(u.titulo)}</b>
              <small>Unidade ${esc(u.ordem)} · ${esc(u.curto)}</small>
            </span>
            <span class="menu-seta" aria-hidden="true">›</span>
          </a>
        </li>`).join('')}
    </ul>`;
}

function leitura(raiz, u, ancora) {
  let ativa = true;
  const base = `#/resumos/${encodeURIComponent(u.id)}`;

  raiz.innerHTML = `
    <div class="sessao-topo">
      <a class="voltar" href="#/resumos">‹ Resumos</a>
      <div class="fonte" role="group" aria-label="Tamanho da letra">
        <button type="button" class="btn-mini" id="menor" aria-label="Diminuir a letra">A−</button>
        <button type="button" class="btn-mini" id="maior" aria-label="Aumentar a letra">A+</button>
      </div>
    </div>
    <article class="resumo" style="--cor:${corSegura(u.cor)}"><p class="carregando">Carregando…</p></article>`;

  const artigo = raiz.querySelector('.resumo');
  const menor = raiz.querySelector('#menor');
  const maior = raiz.querySelector('#maior');

  function aplicarFonte() {
    const t = tamanhoAtual();
    artigo.style.setProperty('--fonte', `${t}px`);
    menor.disabled = t === TAMANHOS[0];
    maior.disabled = t === TAMANHOS[TAMANHOS.length - 1];
  }
  function mudarFonte(passo) {
    const i = TAMANHOS.indexOf(tamanhoAtual()) + passo;
    if (i < 0 || i >= TAMANHOS.length) return;
    store.definirPref('fonteResumo', TAMANHOS[i]);
    aplicarFonte();
  }
  menor.addEventListener('click', () => mudarFonte(-1));
  maior.addEventListener('click', () => mudarFonte(1));
  aplicarFonte();

  function irPara(id, suave) {
    const alvo = id && artigo.querySelector(`#${CSS.escape(id)}`);
    if (alvo) alvo.scrollIntoView({ block: 'start', behavior: suave ? 'smooth' : 'auto' });
  }

  carregarResumo(u).then((md) => {
    if (!ativa) return;
    const { html, titulos } = renderizar(md, (id) => `${base}/${id}`);
    const secoes = titulos.filter((t) => t.nivel === 2);
    const sumario = secoes.length > 1 ? `
      <details class="sumario">
        <summary>Nesta unidade <small>${secoes.length} ${plural(secoes.length, 'seção', 'seções')}</small></summary>
        <ol>${secoes.map((t) => `<li><a href="${base}/${t.id}">${esc(t.texto)}</a></li>`).join('')}</ol>
      </details>` : '';
    // O sumário entra logo depois do título principal.
    const corte = html.indexOf('</h1>');
    artigo.innerHTML = corte >= 0 ? `${html.slice(0, corte + 5)}${sumario}${html.slice(corte + 5)}` : sumario + html;

    artigo.insertAdjacentHTML('afterend', `
      <div class="botoes fim-resumo">
        <a class="btn primario grande" href="#/mais/flashcards/${encodeURIComponent(u.id)}">Flashcards desta unidade</a>
        <button class="btn grande" type="button" id="revisar-unidade">Revisar esta unidade</button>
      </div>`);
    raiz.querySelector('#revisar-unidade').addEventListener('click', () => {
      definirFiltro([u.id]);
      location.hash = '#/revisar';
    });

    // Links do sumário e dos títulos rolam a página sem recarregar a tela.
    artigo.addEventListener('click', (e) => {
      const link = e.target.closest(`a[href^="${base}/"]`);
      if (!link) return;
      e.preventDefault();
      history.replaceState(null, '', link.getAttribute('href'));
      irPara(decodeURIComponent(link.getAttribute('href').slice(base.length + 1)), true);
    });
    if (ancora) setTimeout(() => irPara(ancora, false), 0);
  }).catch((erro) => {
    if (!ativa) return;
    console.error(erro);
    artigo.innerHTML = `
      <section class="vazio">
        <h1>Não foi possível abrir este resumo</h1>
        <p>Verifique a conexão e tente de novo.</p>
        <button class="btn primario" type="button" id="de-novo">Tentar de novo</button>
      </section>`;
    artigo.querySelector('#de-novo').addEventListener('click', () => leitura(raiz, u, ancora));
  });

  return () => { ativa = false; };
}
