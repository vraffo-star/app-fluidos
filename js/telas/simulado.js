// Revisar › Simulado: 20 perguntas já vistas, 30 minutos, resultado só no fim.
import * as store from '../store.js';
import { pergunta } from '../dados.js';
import { hoje, ddmm } from '../datas.js';
import { esc, embaralhar, plural, fmtTempo } from '../util.js';
import { filtroUnidades, vistas } from '../revisao.js';
import { htmlMeta, htmlEnunciado, htmlAlternativas, htmlItemRespondido } from './pergunta.js';

const TAMANHO = 20;
const DURACAO_MS = 30 * 60 * 1000;
const ALERTA_MS = 5 * 60 * 1000;

function relogio(ms) {
  const seg = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(seg / 60)).padStart(2, '0')}:${String(seg % 60).padStart(2, '0')}`;
}

export function subSimulado(raiz, partes, moldura) {
  let tique = null;
  let confirmando = false;

  function parar() {
    if (tique) clearInterval(tique);
    tique = null;
  }

  function desenhar() {
    parar();
    const s = store.simulado();
    if (!s) entrada();
    else if (s.fim) resultado(s);
    else if (Date.now() >= s.inicio + DURACAO_MS) finalizar(s);
    else prova(s);
  }

  function entrada() {
    const corpo = moldura(entrada);
    const disponiveis = vistas(filtroUnidades());
    const n = Math.min(TAMANHO, disponiveis.length);
    const notas = store.simulados().slice().reverse();

    corpo.innerHTML = `
      <section class="cartao dia">
        <p class="rotulo">Simulado</p>
        <p class="dia-texto">${TAMANHO} perguntas · 30 minutos</p>
        <p class="nota">Sorteia só entre perguntas que você já viu, para não gastar as novas do dia. A resposta certa aparece no fim.</p>
        ${n
          ? `${n < TAMANHO ? `<p class="nota">Só há <span class="num">${n}</span> ${plural(n, 'pergunta vista', 'perguntas vistas')} nas unidades escolhidas: o simulado terá ${n}.</p>` : ''}
             <button class="btn primario grande" type="button" id="comecar">Começar simulado</button>`
          : '<p class="nota"><strong>Ainda não há perguntas vistas nas unidades escolhidas.</strong> Responda algumas em Estudar primeiro.</p>'}
      </section>

      <section aria-label="Notas dos simulados">
        <p class="rotulo">Notas anteriores</p>
        ${notas.length
          ? `<ul class="notas">${notas.map((r) => `
              <li>
                <span class="num">${ddmm(r.d)}</span>
                <span class="nota-barra"><span style="width:${r.n ? (r.ac / r.n) * 100 : 0}%"></span></span>
                <span class="num">${r.ac}/${r.n}</span>
                <span class="num nota-pct">${r.n ? Math.round((r.ac / r.n) * 100) : 0}%</span>
              </li>`).join('')}</ul>`
          : '<p class="nota">Nenhum simulado feito ainda.</p>'}
      </section>`;

    corpo.querySelector('#comecar')?.addEventListener('click', () => {
      const ids = embaralhar(disponiveis).slice(0, n).map((q) => q.id);
      store.definirSimulado({ ids, pos: 0, resp: {}, inicio: Date.now(), data: hoje() });
      desenhar();
    });
  }

  function prova(s) {
    const total = s.ids.length;
    const q = pergunta(s.ids[s.pos]);
    if (!q) {
      // Pergunta que saiu dos dados: tira do simulado e segue.
      s.ids.splice(s.pos, 1);
      s.pos = Math.min(s.pos, Math.max(0, s.ids.length - 1));
      store.definirSimulado(s);
      if (s.ids.length) prova(s);
      else { store.definirSimulado(null); desenhar(); }
      return;
    }
    const respondidas = s.ids.filter((id) => s.resp[id] !== undefined).length;
    const faltam = total - respondidas;
    const ultima = s.pos === total - 1;
    const escolha = s.resp[q.id] ?? null;

    raiz.innerHTML = `
      <div class="sessao-topo">
        <span class="num relogio" id="relogio" aria-label="Tempo restante"></span>
        <div class="barra" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${respondidas}" aria-label="Perguntas respondidas">
          <span style="width:${(respondidas / total) * 100}%"></span>
        </div>
        <span class="num sessao-conta">${s.pos + 1}/${total}</span>
        <button type="button" class="btn-mini" id="encerrar">Finalizar</button>
      </div>
      ${confirmando ? `
        <section class="cartao confirma" role="alertdialog" aria-labelledby="conf-t">
          <h2 id="conf-t">Finalizar o simulado?</h2>
          <p>${faltam
            ? `${plural(faltam, 'Falta', 'Faltam')} <span class="num">${faltam}</span> ${plural(faltam, 'pergunta', 'perguntas')} sem resposta. Elas contam como erro na nota.`
            : 'Todas as perguntas foram respondidas.'}</p>
          <div class="botoes">
            <button class="btn primario grande" type="button" id="conf-sim">Finalizar agora</button>
            <button class="btn grande" type="button" id="conf-nao">Continuar respondendo</button>
          </div>
        </section>` : `
        <article class="pergunta">
          ${htmlMeta(q)}
          ${htmlEnunciado(q)}
          ${htmlAlternativas(q, escolha, true)}
        </article>
        <div class="acao-fixa dupla">
          <button class="btn grande" type="button" id="ant"${s.pos === 0 ? ' disabled' : ''}>Anterior</button>
          <button class="btn primario grande" type="button" id="prox">${ultima ? 'Finalizar' : 'Próxima'}</button>
        </div>`}`;

    const mostrador = raiz.querySelector('#relogio');
    const atualizar = () => {
      const resta = s.inicio + DURACAO_MS - Date.now();
      if (resta <= 0) {
        finalizar(s);
        return;
      }
      mostrador.textContent = relogio(resta);
      mostrador.classList.toggle('alerta', resta <= ALERTA_MS);
    };
    atualizar();
    if (s.fim) return;
    parar();
    tique = setInterval(atualizar, 500);

    const pedirConfirmacao = () => { confirmando = true; prova(s); window.scrollTo(0, 0); };
    raiz.querySelector('#encerrar').addEventListener('click', pedirConfirmacao);

    if (confirmando) {
      raiz.querySelector('#conf-sim').addEventListener('click', () => finalizar(s));
      raiz.querySelector('#conf-nao').addEventListener('click', () => { confirmando = false; prova(s); });
      return;
    }

    raiz.querySelector('.alts').addEventListener('click', (e) => {
      const botao = e.target.closest('.alt');
      if (!botao) return;
      const i = Number(botao.dataset.i);
      // Tocar de novo na mesma alternativa desmarca.
      if (s.resp[q.id] === i) delete s.resp[q.id];
      else s.resp[q.id] = i;
      store.definirSimulado(s);
      const rolagem = window.scrollY;
      prova(s);
      window.scrollTo(0, rolagem);
    });
    raiz.querySelector('#ant').addEventListener('click', () => {
      s.pos--;
      store.definirSimulado(s);
      prova(s);
      window.scrollTo(0, 0);
    });
    raiz.querySelector('#prox').addEventListener('click', () => {
      if (ultima) {
        pedirConfirmacao();
        return;
      }
      s.pos++;
      store.definirSimulado(s);
      prova(s);
      window.scrollTo(0, 0);
    });
  }

  // Grava as respostas dadas como tentativas (erro entra na caixa 1) e guarda a nota.
  function finalizar(s) {
    parar();
    confirmando = false;
    s.ids = s.ids.filter((id) => pergunta(id));
    let acertos = 0;
    for (const id of s.ids) {
      const escolha = s.resp[id];
      if (escolha === undefined) continue;
      const acertou = escolha === pergunta(id).correta;
      store.responder(id, escolha, acertou, hoje());
      if (acertou) acertos++;
    }
    s.fim = true;
    s.ac = acertos;
    s.ms = Math.min(Date.now() - s.inicio, DURACAO_MS);
    store.definirSimulado(s);
    store.guardarNota({ d: hoje(), n: s.ids.length, ac: acertos, ms: s.ms });
    desenhar();
    window.scrollTo(0, 0);
  }

  function resultado(s) {
    const qs = s.ids.map(pergunta).filter(Boolean);
    const total = s.ids.length;
    const pct = total ? Math.round((s.ac / total) * 100) : 0;
    const semResposta = qs.filter((q) => s.resp[q.id] === undefined).length;

    raiz.innerHTML = `
      <section class="resultado">
        <p class="rotulo">Simulado</p>
        <h1>Resultado do simulado</h1>
        <div class="placar">
          <div><span class="num">${s.ac}/${total}</span><small>acertos</small></div>
          <div><span class="num">${pct}%</span><small>nota</small></div>
          <div><span class="num">${fmtTempo(s.ms)}</span><small>tempo</small></div>
        </div>
        ${semResposta ? `<p class="nota">${semResposta} ${plural(semResposta, 'pergunta ficou', 'perguntas ficaram')} sem resposta.</p>` : ''}
        <div class="botoes">
          <button class="btn grande" type="button" id="fechar">Concluir</button>
        </div>
        <h2 class="secao">Revisão das questões</h2>
        <p class="nota">As erradas entraram na revisão espaçada. Toque numa questão para abrir ou fechar.</p>
        <ol class="gabarito">
          ${qs.map((q, i) => {
            const escolha = s.resp[q.id];
            const acertou = escolha === q.correta;
            const marca = escolha === undefined ? '—' : acertou ? '✓' : '✗';
            return `
              <li>
                <details${acertou ? '' : ' open'}>
                  <summary>
                    <span class="hist-marca ${acertou ? 'ok' : 'erro'}" aria-hidden="true">${marca}</span>
                    <span class="num">${i + 1}.</span>
                    <span class="so-leitor">${escolha === undefined ? 'sem resposta' : acertou ? 'acertou' : 'errou'}</span>
                    <span class="gab-tema">${esc(q.tema)}</span>
                  </summary>
                  <div class="errada-item">${htmlItemRespondido(q, escolha)}</div>
                </details>
              </li>`;
          }).join('')}
        </ol>
      </section>`;

    raiz.querySelector('#fechar').addEventListener('click', () => {
      store.definirSimulado(null);
      desenhar();
      window.scrollTo(0, 0);
    });
  }

  desenhar();
  return parar;
}
