// Regras da aba Revisar: filtro por unidade, revisão espaçada (caixas) e perguntas já vistas.
import * as store from './store.js';
import { listaUnidades, pergunta, todasPerguntas } from './dados.js';
import { hoje } from './datas.js';

// Unidades escolhidas nas abas de Revisar. Sem escolha salva = todas (inclusive as que chegarem depois).
export function filtroUnidades() {
  const todas = listaUnidades().map((u) => u.id);
  const salvo = store.pref('revUnidades');
  const validas = Array.isArray(salvo) ? salvo.filter((id) => todas.includes(id)) : [];
  return new Set(validas.length ? validas : todas);
}

export function filtroEhTudo() {
  return filtroUnidades().size === listaUnidades().length;
}

export function limparFiltro() {
  store.definirPref('revUnidades', null);
}

export function definirFiltro(ids) {
  const total = listaUnidades().length;
  store.definirPref('revUnidades', ids.length && ids.length < total ? ids : null);
}

// Partindo de "todas", tocar numa unidade fica só com ela; depois disso, cada toque liga/desliga.
export function alternarUnidade(id) {
  const total = listaUnidades().length;
  const atual = filtroUnidades();
  let novo;
  if (atual.size === total) novo = [id];
  else {
    if (atual.has(id)) atual.delete(id);
    else atual.add(id);
    novo = [...atual];
  }
  definirFiltro(novo);
}

// Perguntas na revisão espaçada (que ainda existem nos dados). `unidades` nulo = todas.
function naRevisao(unidades) {
  return store.emRevisao()
    .map((r) => ({ ...r, q: pergunta(r.id) }))
    .filter((r) => r.q && (!unidades || unidades.has(r.q.unidade)));
}

export function vencidas(unidades = null) {
  return naRevisao(unidades).filter((r) => r.prox <= hoje()).map((r) => r.q);
}

// Quantas perguntas há em cada caixa (índice 0 = caixa 1).
export function caixas(unidades = null) {
  const n = store.INTERVALOS.map(() => 0);
  for (const r of naRevisao(unidades)) if (n[r.caixa - 1] !== undefined) n[r.caixa - 1]++;
  return n;
}

// Próxima data futura com revisão e quantas perguntas vencem nela.
export function proximaRevisao(unidades = null) {
  const futuras = naRevisao(unidades).filter((r) => r.prox > hoje());
  if (!futuras.length) return null;
  const data = futuras.reduce((m, r) => (r.prox < m ? r.prox : m), futuras[0].prox);
  return { data, n: futuras.filter((r) => r.prox === data).length };
}

export function vistas(unidades = null) {
  return todasPerguntas().filter((q) => store.foiVista(q.id) && (!unidades || unidades.has(q.unidade)));
}
