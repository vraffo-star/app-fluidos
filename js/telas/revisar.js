// Aba Revisar: sub-abas (Revisão espaçada · Simulado · Histórico) e filtro por unidade comum às três.
import { listaUnidades } from '../dados.js';
import { esc, corSegura } from '../util.js';
import { filtroUnidades, filtroEhTudo, alternarUnidade, limparFiltro } from '../revisao.js';
import { subEspacada } from './espacada.js';
import { subSimulado } from './simulado.js';
import { subHistorico } from './historico.js';

const SUBABAS = [
  { id: 'revisao', rotulo: 'Revisão', href: '#/revisar', tela: subEspacada },
  { id: 'simulado', rotulo: 'Simulado', href: '#/revisar/simulado', tela: subSimulado },
  { id: 'historico', rotulo: 'Histórico', href: '#/revisar/historico', tela: subHistorico },
];

// Desenha sub-abas + filtro e devolve o elemento onde a sub-aba põe o conteúdo.
// `aoMudar` é chamado quando o filtro de unidades muda.
function moldura(raiz, ativa, aoMudar) {
  const escolhidas = filtroUnidades();
  const tudo = filtroEhTudo();
  raiz.innerHTML = `
    <nav class="subabas" aria-label="Seções de Revisar">
      ${SUBABAS.map((s) => `<a href="${s.href}"${s.id === ativa ? ' aria-current="page"' : ''}>${s.rotulo}</a>`).join('')}
    </nav>
    <div class="filtro" role="group" aria-label="Filtrar por unidade">
      <button type="button" class="ficha" data-u="" aria-pressed="${tudo}">Todas</button>
      ${listaUnidades().map((u) => `
        <button type="button" class="ficha com-cor" data-u="${esc(u.id)}" style="--cor:${corSegura(u.cor)}"
                aria-pressed="${!tudo && escolhidas.has(u.id)}">${esc(u.curto)}</button>`).join('')}
    </div>
    <div class="sub"></div>`;

  raiz.querySelector('.filtro').addEventListener('click', (e) => {
    const ficha = e.target.closest('.ficha');
    if (!ficha) return;
    if (ficha.dataset.u) alternarUnidade(ficha.dataset.u);
    else limparFiltro();
    aoMudar();
  });
  return raiz.querySelector('.sub');
}

export function telaRevisar(raiz, partes) {
  const sub = SUBABAS.find((s) => s.id === partes[0]) || SUBABAS[0];
  const resto = sub === SUBABAS[0] ? [] : partes.slice(1);
  return sub.tela(raiz, resto, (aoMudar) => moldura(raiz, sub.id, aoMudar));
}
