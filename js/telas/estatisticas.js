// Mais › Estatísticas: acerto por unidade e por dificuldade, respostas por dia (14 dias), racha e simulados.
import * as store from '../store.js';
import { listaUnidades, todasPerguntas } from '../dados.js';
import { hoje, somarDias, ddmm } from '../datas.js';
import { esc, corSegura, plural } from '../util.js';
import { racha } from '../estudo.js';
import { DIFICULDADE } from './pergunta.js';
import { htmlNotas } from './simulado.js';

const DIAS = 14;

// Soma as tentativas das perguntas que passam no filtro.
function desempenho(filtro) {
  const r = { respostas: 0, acertos: 0, vistas: 0, total: 0 };
  for (const q of todasPerguntas()) {
    if (!filtro(q)) continue;
    r.total++;
    const t = store.registro(q.id)?.t;
    if (!t?.length) continue;
    r.vistas++;
    r.respostas += t.length;
    r.acertos += t.filter((x) => x.a).length;
  }
  return r;
}

function htmlLinha(rotulo, d, cor) {
  const pct = d.respostas ? Math.round((d.acertos / d.respostas) * 100) : null;
  return `
    <li class="est-linha">
      <span class="est-rotulo${cor ? ' chip' : ''}"${cor ? ` style="--cor:${cor}"` : ''}>${esc(rotulo)}</span>
      <span class="num est-valor">${pct === null ? '—' : `${pct}%`}</span>
      <span class="est-trilho"><span style="width:${pct || 0}%${cor ? `;background:${cor}` : ''}"></span></span>
      <small>${d.respostas
        ? `${d.acertos} de ${d.respostas} ${plural(d.respostas, 'resposta certa', 'respostas certas')} · ${d.vistas} de ${d.total} perguntas vistas`
        : `Sem respostas ainda · ${d.total} ${plural(d.total, 'pergunta', 'perguntas')}`}</small>
    </li>`;
}

function htmlDias() {
  const reg = store.dias();
  const dias = Array.from({ length: DIAS }, (_, i) => {
    const d = somarDias(hoje(), i - DIAS + 1);
    return { d, n: reg[d]?.[0] || 0, ac: reg[d]?.[1] || 0 };
  });
  const maximo = Math.max(1, ...dias.map((x) => x.n));
  const soma = dias.reduce((s, x) => s + x.n, 0);
  const legenda = (x) => (x.n
    ? `${ddmm(x.d)}: ${x.n} ${plural(x.n, 'resposta', 'respostas')}, ${Math.round((x.ac / x.n) * 100)}% de acerto`
    : `${ddmm(x.d)}: nenhuma resposta`);

  const html = `
    <div class="dias-grafico" role="group" aria-label="Perguntas respondidas por dia, últimos ${DIAS} dias">
      <span class="dias-max num" aria-hidden="true">${maximo}</span>
      <div class="dias-barras">
        ${dias.map((x, i) => `
          <button type="button" class="dia-coluna" data-i="${i}" aria-pressed="${i === DIAS - 1}" aria-label="${esc(legenda(x))}">
            <span class="dia-barra${x.n ? '' : ' zero'}" style="height:${x.n ? Math.max(3, (x.n / maximo) * 100) : 0}%"></span>
            <span class="dia-num num">${x.d.slice(8)}</span>
          </button>`).join('')}
      </div>
    </div>
    <p class="nota" id="dia-legenda" aria-live="polite">${esc(legenda(dias[DIAS - 1]))}</p>
    <p class="nota">Total em ${DIAS} dias: <span class="num">${soma}</span> · média de <span class="num">${(soma / DIAS).toFixed(1).replace('.', ',')}</span> por dia. Toque numa barra para ver o dia.</p>`;
  return { html, legendas: dias.map(legenda) };
}

export function telaEstatisticas(raiz) {
  const r = racha();
  const { respondidas, acertos } = store.totais();
  const estudados = Object.values(store.dias()).filter((d) => d[0] > 0).length;
  const notas = store.simulados();
  const porDia = htmlDias();
  const media = notas.length
    ? Math.round((notas.reduce((s, n) => s + (n.n ? n.ac / n.n : 0), 0) / notas.length) * 100)
    : null;

  raiz.innerHTML = `
    <div class="sessao-topo"><a class="voltar" href="#/mais">‹ Mais</a></div>
    <header class="cabeca">
      <p class="rotulo">Estatísticas</p>
      <h1>Seu desempenho</h1>
    </header>

    <section class="par" aria-label="Totais">
      <div class="medida">
        <p class="rotulo">Respostas</p>
        <p><span class="num">${respondidas}</span></p>
        <small>${respondidas ? `${Math.round((acertos / respondidas) * 100)}% de acerto` : 'nenhuma ainda'}</small>
      </div>
      <div class="medida">
        <p class="rotulo">Racha</p>
        <p><span class="num">${r.atual}</span> ${plural(r.atual, 'dia', 'dias')}</p>
        <small>maior: ${r.maior} · ${estudados} ${plural(estudados, 'dia estudado', 'dias estudados')}</small>
      </div>
    </section>

    <section class="est-secao">
      <h2 class="secao">Acerto por unidade</h2>
      <ul class="est-lista">
        ${listaUnidades().map((u) => htmlLinha(u.curto, desempenho((q) => q.unidade === u.id), corSegura(u.cor))).join('')}
      </ul>
    </section>

    <section class="est-secao">
      <h2 class="secao">Acerto por dificuldade</h2>
      <ul class="est-lista">
        ${[1, 2, 3].map((d) => htmlLinha(DIFICULDADE[d], desempenho((q) => (DIFICULDADE[q.dificuldade] ? q.dificuldade : 2) === d))).join('')}
      </ul>
    </section>

    <section class="est-secao">
      <h2 class="secao">Respondidas por dia</h2>
      ${porDia.html}
    </section>

    <section class="est-secao">
      <h2 class="secao">Simulados</h2>
      ${media === null ? '' : `<p class="nota">${notas.length} ${plural(notas.length, 'simulado', 'simulados')} · média de <span class="num">${media}%</span></p>`}
      ${htmlNotas(notas)}
    </section>`;

  const colunas = raiz.querySelectorAll('.dia-coluna');
  raiz.querySelector('.dias-barras').addEventListener('click', (e) => {
    const coluna = e.target.closest('.dia-coluna');
    if (!coluna) return;
    for (const c of colunas) c.setAttribute('aria-pressed', c === coluna);
    raiz.querySelector('#dia-legenda').textContent = porDia.legendas[Number(coluna.dataset.i)];
  });
}
