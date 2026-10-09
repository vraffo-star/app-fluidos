import * as store from '../store.js';
import { plural } from '../util.js';
import { pendentes, bancoEsgotado, racha } from '../estudo.js';
import { vencidas as revisoesVencidas } from '../revisao.js';
import { iniciarSessao } from './estudar.js';

function htmlCartaoDoDia() {
  const s = store.sessao();
  const emCurso = s && s.pos < s.ids.length;
  const n = pendentes();

  if (emCurso) {
    return `
      <p class="rotulo">Hoje</p>
      <p class="dia-texto"><span class="num">${n}</span> ${plural(n, 'pergunta nova pendente', 'perguntas novas pendentes')}</p>
      <button class="btn primario grande" type="button" id="estudar">Continuar sessão <small class="num">${s.pos + 1}/${s.ids.length}</small></button>`;
  }
  if (bancoEsgotado()) {
    return `
      <p class="rotulo">Hoje</p>
      <p class="dia-texto">Você respondeu todas as perguntas disponíveis 🎉</p>
      <p class="nota">Use Revisar e Simulado.</p>`;
  }
  if (n === 0) {
    return `
      <p class="rotulo">Hoje</p>
      <p class="dia-texto">✓ Meta de hoje cumprida</p>
      <p class="nota">Amanhã entram mais perguntas novas.</p>`;
  }
  return `
    <p class="rotulo">Hoje</p>
    <p class="dia-texto"><span class="num">${n}</span> ${plural(n, 'pergunta nova pendente', 'perguntas novas pendentes')}</p>
    <button class="btn primario grande" type="button" id="estudar">Estudar</button>`;
}

export function telaInicio(raiz) {
  const r = racha();
  const { respondidas, acertos } = store.totais();
  const pct = respondidas ? `${Math.round((acertos / respondidas) * 100)}%` : '—';
  const vencidas = revisoesVencidas().length;

  raiz.innerHTML = `
    <header class="topo">
      <p class="marca">Fluidos <span>· Estudo</span></p>
    </header>

    <section class="par" aria-label="Racha">
      <div class="medida">
        <p class="rotulo">Racha</p>
        <p><span class="num">${r.atual}</span> ${plural(r.atual, 'dia', 'dias')}</p>
        <small>${r.atual && !r.estudouHoje ? 'Estude hoje para manter' : 'dias seguidos'}</small>
      </div>
      <div class="medida">
        <p class="rotulo">Maior racha</p>
        <p><span class="num">${r.maior}</span> ${plural(r.maior, 'dia', 'dias')}</p>
        <small>seu recorde</small>
      </div>
    </section>

    <section class="cartao dia">${htmlCartaoDoDia()}</section>

    <nav class="atalhos" aria-label="Atalhos">
      <a href="#/revisar"${vencidas ? ' class="tem"' : ''}>
        <b>Revisão</b>
        <small><span class="num">${vencidas}</span> ${plural(vencidas, 'vencida', 'vencidas')}</small>
      </a>
      <a href="#/revisar/simulado">
        <b>Simulado</b>
        <small>20 perguntas</small>
      </a>
      <a href="#/mais/flashcards">
        <b>Flashcards</b>
        <small>por unidade</small>
      </a>
    </nav>

    <section class="par" aria-label="Resumo">
      <div class="medida">
        <p class="rotulo">Respondidas</p>
        <p><span class="num">${respondidas}</span></p>
        <small>no total</small>
      </div>
      <div class="medida">
        <p class="rotulo">Acerto</p>
        <p><span class="num">${pct}</span></p>
        <small>de todas as respostas</small>
      </div>
    </section>`;

  raiz.querySelector('#estudar')?.addEventListener('click', () => {
    const s = store.sessao();
    if (!s || s.pos >= s.ids.length) iniciarSessao();
    location.hash = '#/estudar';
  });
}
