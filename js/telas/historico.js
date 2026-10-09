// Revisar › Histórico: todas as perguntas já respondidas, com filtros, detalhe e "Refazer".
import * as store from '../store.js';
import { pergunta, unidade } from '../dados.js';
import { hoje, ddmm } from '../datas.js';
import { esc, rico, plural } from '../util.js';
import { filtroUnidades, vistas } from '../revisao.js';
import {
  DIFICULDADE, htmlMeta, htmlEnunciado, htmlAlternativas, htmlExplicacao, htmlEstrela, ligarEstrela, telaPergunta,
} from './pergunta.js';

const LOTE = 60;

// Os filtros (e a rolagem da lista) valem enquanto a app estiver aberta, para voltar do detalhe no mesmo lugar.
const filtros = { resultado: '', favoritas: false, dificuldade: 0, busca: '' };
let rolagem = 0;

const semAcento = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const textoBusca = new Map();
function palavras(q) {
  if (!textoBusca.has(q.id)) {
    textoBusca.set(q.id, semAcento([q.enunciado, q.tema, ...(q.afirmativas || []), ...q.alternativas, q.explicacao].join(' ')));
  }
  return textoBusca.get(q.id);
}

function ultima(q) {
  const t = store.registro(q.id).t;
  return t[t.length - 1];
}

export function subHistorico(raiz, partes, moldura) {
  if (partes[0]) detalhe(partes[0]);
  else lista();

  function filtradas() {
    const termos = semAcento(filtros.busca).split(/\s+/).filter(Boolean);
    return vistas(filtroUnidades())
      .filter((q) => {
        const u = ultima(q);
        if (filtros.resultado === 'acertei' && !u.a) return false;
        if (filtros.resultado === 'errei' && u.a) return false;
        if (filtros.favoritas && !store.favorita(q.id)) return false;
        if (filtros.dificuldade && q.dificuldade !== filtros.dificuldade) return false;
        return termos.every((t) => palavras(q).includes(t));
      })
      // Mais recentes primeiro; no mesmo dia, mantém a ordem dos dados.
      .map((q, i) => ({ q, i, d: ultima(q).d }))
      .sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : a.i - b.i))
      .map((x) => x.q);
  }

  function lista() {
    const corpo = moldura(lista);
    let mostrando = LOTE;

    corpo.innerHTML = `
      <div class="hist-filtros">
        <input type="search" id="busca" class="campo" placeholder="Buscar no texto…" aria-label="Buscar no texto"
               value="${esc(filtros.busca)}" autocomplete="off" enterkeyhint="search">
        <div class="hist-linha">
          <select id="resultado" class="campo" aria-label="Resultado da última resposta">
            <option value="">Acertei e errei</option>
            <option value="acertei"${filtros.resultado === 'acertei' ? ' selected' : ''}>Acertei</option>
            <option value="errei"${filtros.resultado === 'errei' ? ' selected' : ''}>Errei</option>
          </select>
          <select id="dificuldade" class="campo" aria-label="Dificuldade">
            <option value="0">Toda dificuldade</option>
            ${[1, 2, 3].map((d) => `<option value="${d}"${filtros.dificuldade === d ? ' selected' : ''}>${DIFICULDADE[d]}</option>`).join('')}
          </select>
          <button type="button" class="ficha" id="favoritas" aria-pressed="${filtros.favoritas}">★ Favoritas</button>
        </div>
      </div>
      <p class="nota" id="conta" aria-live="polite"></p>
      <ul class="hist-lista" id="itens"></ul>
      <button type="button" class="btn" id="mais" hidden>Mostrar mais</button>`;

    const itens = corpo.querySelector('#itens');
    const conta = corpo.querySelector('#conta');
    const mais = corpo.querySelector('#mais');

    function preencher() {
      const todas = filtradas();
      const total = vistas().length;
      conta.textContent = total
        ? `${todas.length} ${plural(todas.length, 'pergunta', 'perguntas')}${todas.length !== total ? ` de ${total} respondidas` : plural(todas.length, ' respondida', ' respondidas')}`
        : 'Você ainda não respondeu nenhuma pergunta. Comece pela aba Estudar.';
      itens.innerHTML = todas.slice(0, mostrando).map((q) => {
        const u = ultima(q);
        const un = unidade(q.unidade);
        return `
          <li>
            <a class="hist-item" href="#/revisar/historico/${encodeURIComponent(q.id)}">
              <span class="hist-marca ${u.a ? 'ok' : 'erro'}" aria-hidden="true">${u.a ? '✓' : '✗'}</span>
              <span class="hist-texto">
                <span class="hist-enun">${rico(q.enunciado)}</span>
                <small>${esc(un?.curto || q.unidade)} · ${esc(q.tema)} · ${ddmm(u.d)}${store.favorita(q.id) ? ' · ★' : ''}<span class="so-leitor"> · ${u.a ? 'acertei' : 'errei'}</span></small>
              </span>
            </a>
          </li>`;
      }).join('');
      mais.hidden = todas.length <= mostrando;
    }

    const mudou = () => { mostrando = LOTE; preencher(); };
    corpo.querySelector('#busca').addEventListener('input', (e) => { filtros.busca = e.target.value; mudou(); });
    corpo.querySelector('#resultado').addEventListener('change', (e) => { filtros.resultado = e.target.value; mudou(); });
    corpo.querySelector('#dificuldade').addEventListener('change', (e) => { filtros.dificuldade = Number(e.target.value); mudou(); });
    corpo.querySelector('#favoritas').addEventListener('click', (e) => {
      filtros.favoritas = !filtros.favoritas;
      e.currentTarget.setAttribute('aria-pressed', filtros.favoritas);
      mudou();
    });
    mais.addEventListener('click', () => { mostrando += LOTE; preencher(); });
    itens.addEventListener('click', (e) => {
      if (e.target.closest('.hist-item')) rolagem = window.scrollY;
    });

    preencher();
    if (rolagem) {
      const y = rolagem;
      rolagem = 0;
      setTimeout(() => window.scrollTo(0, y), 0);
    }
  }

  function detalhe(id) {
    const q = pergunta(id);
    const reg = q && store.registro(id);
    if (!q || !reg?.t?.length) {
      location.replace('#/revisar/historico');
      return;
    }
    const u = reg.t[reg.t.length - 1];
    const tentativas = reg.t.map((t) => `<li class="${t.a ? 'ok' : 'erro'}"><span class="num">${ddmm(t.d)}</span> ${t.a ? '✓' : '✗'}<span class="so-leitor"> ${t.a ? 'acertei' : 'errei'}</span></li>`).join('');

    raiz.innerHTML = `
      <div class="sessao-topo">
        <a class="voltar" href="#/revisar/historico">‹ Histórico</a>
        ${htmlEstrela(q.id)}
      </div>
      <article class="pergunta">
        ${htmlMeta(q)}
        ${htmlEnunciado(q)}
        ${htmlAlternativas(q, u.e)}
        ${htmlExplicacao(q, u.e)}
        <section class="tentativas">
          <p class="rotulo">${reg.t.length} ${plural(reg.t.length, 'tentativa', 'tentativas')} · acima, a mais recente</p>
          <ul>${tentativas}</ul>
          ${reg.rev ? `<p class="nota">Na revisão espaçada: caixa ${reg.rev.caixa}, volta em ${ddmm(reg.rev.prox)}.</p>` : ''}
        </section>
      </article>
      <div class="acao-fixa">
        <button class="btn primario grande" type="button" id="refazer">Refazer</button>
      </div>`;

    ligarEstrela(raiz, q.id);
    raiz.querySelector('#refazer').addEventListener('click', () => {
      window.scrollTo(0, 0);
      telaPergunta(raiz, {
        q,
        voltar: { href: '#/revisar/historico', rotulo: 'Histórico' },
        proxima: 'Ver no histórico',
        aoResponder(i, acertou) {
          store.responder(q.id, i, acertou, hoje());
          return acertou ? '' : 'Entrou na caixa 1 da revisão espaçada.';
        },
        aoProxima() {
          detalhe(id);
          window.scrollTo(0, 0);
        },
      });
    });
  }
}
