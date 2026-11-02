import * as store from '../store.js';
import { pergunta } from '../dados.js';
import { hoje } from '../datas.js';
import { esc, plural, fmtTempo } from '../util.js';
import { pendentes, montarSessao, bancoEsgotado, sessaoAtual, TAM_SESSAO } from '../estudo.js';
import { telaPergunta, htmlItemRespondido } from './pergunta.js';

// Pausas longas (app em segundo plano) não entram no tempo da sessão.
const TETO_POR_PERGUNTA_MS = 5 * 60 * 1000;

// Cria e salva uma sessão nova, se houver perguntas pendentes.
export function iniciarSessao() {
  const ids = montarSessao();
  if (!ids.length) return null;
  const s = { ids, pos: 0, resp: {}, ms: 0, data: hoje() };
  store.definirSessao(s);
  return s;
}

export function telaEstudar(raiz) {
  let marca = Date.now();

  function contarTempo(s) {
    s.ms += Math.min(Date.now() - marca, TETO_POR_PERGUNTA_MS);
    marca = Date.now();
  }

  function desenhar() {
    // Sem as perguntas que saíram dos dados.
    let s = sessaoAtual();
    // Resultado de um dia anterior não fica preso na tela.
    if (s && s.pos >= s.ids.length && s.data !== hoje()) {
      store.definirSessao(null);
      s = null;
    }

    if (!s) desenharEntrada();
    else if (s.pos >= s.ids.length) desenharResultado(s);
    else desenharPergunta(s);
  }

  function desenharEntrada() {
    const n = pendentes();
    if (bancoEsgotado()) {
      raiz.innerHTML = `
        <section class="vazio">
          <h1>Você respondeu todas as perguntas disponíveis 🎉</h1>
          <p>Use Revisar e Simulado.</p>
          <a class="btn" href="#/revisar">Ir para Revisar</a>
        </section>`;
      return;
    }
    if (n === 0) {
      raiz.innerHTML = `
        <section class="vazio">
          <p class="rotulo">Estudar</p>
          <h1>✓ Meta de hoje cumprida</h1>
          <p>Amanhã entram mais perguntas novas. Enquanto isso, use Revisar.</p>
          <a class="btn" href="#/revisar">Ir para Revisar</a>
        </section>`;
      return;
    }
    const tamanho = Math.min(TAM_SESSAO, n);
    raiz.innerHTML = `
      <section class="vazio">
        <p class="rotulo">Estudar</p>
        <h1><span class="num">${n}</span> ${plural(n, 'pergunta nova pendente', 'perguntas novas pendentes')}</h1>
        <p>Sessão de ${tamanho} ${plural(tamanho, 'pergunta', 'perguntas')}. Dá para fechar a app e continuar depois do mesmo ponto.</p>
        <button class="btn primario grande" type="button" id="comecar">Começar</button>
      </section>`;
    raiz.querySelector('#comecar').addEventListener('click', () => {
      iniciarSessao();
      marca = Date.now();
      desenhar();
    });
  }

  function desenharPergunta(s) {
    const q = pergunta(s.ids[s.pos]);
    const total = s.ids.length;
    telaPergunta(raiz, {
      q,
      escolha: s.resp[q.id] ? s.resp[q.id][0] : null,
      progresso: { atual: s.pos + 1, total },
      proxima: s.pos === total - 1 ? 'Ver resultado' : 'Próxima',
      aoResponder(i, acertou) {
        store.responder(q.id, i, acertou, hoje());
        s.resp[q.id] = [i, acertou ? 1 : 0];
        contarTempo(s);
        store.definirSessao(s);
      },
      aoProxima() {
        contarTempo(s);
        s.pos++;
        store.definirSessao(s);
        desenhar();
        window.scrollTo(0, 0);
      },
    });
  }

  function desenharResultado(s) {
    const feitas = s.ids.map(pergunta).filter((q) => q && s.resp[q.id]);
    const erradas = feitas.filter((q) => !s.resp[q.id][1]);
    const acertos = feitas.length - erradas.length;
    const pct = feitas.length ? Math.round((acertos / feitas.length) * 100) : 0;
    const restam = pendentes();

    const lista = erradas
      .map((q) => `<li class="errada-item">${htmlItemRespondido(q, s.resp[q.id][0])}</li>`)
      .join('');

    raiz.innerHTML = `
      <section class="resultado">
        <p class="rotulo">Estudar</p>
        <h1>Sessão concluída</h1>
        <div class="placar">
          <div><span class="num">${acertos}/${feitas.length}</span><small>acertos</small></div>
          <div><span class="num">${pct}%</span><small>aproveitamento</small></div>
          <div><span class="num">${esc(fmtTempo(s.ms))}</span><small>tempo</small></div>
        </div>
        <div class="botoes">
          ${restam > 0
            ? `<button class="btn primario grande" type="button" id="outra">Mais uma sessão <small>(${restam} ${plural(restam, 'pendente', 'pendentes')})</small></button>`
            : ''}
          <button class="btn grande" type="button" id="sair">Voltar ao início</button>
        </div>
        <h2 class="secao">${erradas.length
          ? `${erradas.length} ${plural(erradas.length, 'pergunta errada', 'perguntas erradas')}`
          : 'Nenhum erro nesta sessão ✓'}</h2>
        ${erradas.length ? `<p class="nota">Elas entraram na revisão espaçada.</p><ul class="erradas">${lista}</ul>` : ''}
      </section>`;

    raiz.querySelector('#outra')?.addEventListener('click', () => {
      iniciarSessao();
      marca = Date.now();
      desenhar();
      window.scrollTo(0, 0);
    });
    raiz.querySelector('#sair').addEventListener('click', () => {
      store.definirSessao(null);
      location.hash = '#/inicio';
    });
  }

  desenhar();
}
