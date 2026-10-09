// Única porta de acesso ao localStorage. Tudo fica numa só chave.
//
// Formato:
// {
//   v: 1,
//   dia1: 'YYYY-MM-DD',                 primeiro dia em que a app foi aberta
//   perguntas: { [id]: {
//       t: [{ d, e, a }],               tentativas: data, escolha (índice), acertou (0/1); t[0] é a primeira resposta
//       fav: true,                      favorita
//       rev: { caixa, prox }            revisão espaçada: caixa 1–5 e próxima data
//   } },
//   dias: { 'YYYY-MM-DD': [respondidas, acertos] },
//   sessao: { ids, pos, resp: { [id]: [escolha, acertou] }, ms, data } | null,
//   simulado: { ids, pos, resp: { [id]: escolha }, inicio, data, fim?, ms?, ac? } | null,   (inicio = relógio real, em ms)
//   simulados: [{ d, n, ac, ms }],      histórico de notas
//   prefs: { revUnidades: [ids] | null, fonteResumo: px }
// }
import { somarDias } from './datas.js';

const CHAVE = 'fluidos:v1';
export const INTERVALOS = [1, 3, 7, 14, 30];

let est = vazio();

function vazio() {
  return { v: 1, dia1: null, perguntas: {}, dias: {}, sessao: null, simulado: null, simulados: [], prefs: {} };
}

export function carregar() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    est = bruto ? { ...vazio(), ...JSON.parse(bruto) } : vazio();
  } catch {
    est = vazio();
  }
}

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(est));
  } catch {
    // Sem espaço ou sem acesso: a app segue funcionando só em memória.
  }
}

// Guarda o dia 1 na primeira abertura. Devolve true se esta é a primeira.
export function primeiraAbertura(hoje) {
  if (est.dia1) return false;
  est.dia1 = hoje;
  salvar();
  return true;
}

// Apaga o progresso e recomeça a contagem de dias hoje. As preferências (tamanho da letra, filtro) ficam.
export function zerar(hoje) {
  est = { ...vazio(), dia1: hoje, prefs: est.prefs };
  salvar();
}

export function dia1() {
  return est.dia1;
}

export function registro(id) {
  return est.perguntas[id] || null;
}

export function foiVista(id) {
  return !!est.perguntas[id]?.t?.length;
}

export function totalVistas() {
  let n = 0;
  for (const id in est.perguntas) if (est.perguntas[id].t?.length) n++;
  return n;
}

// Ids que estão na revisão espaçada, com caixa e próxima data.
export function emRevisao() {
  const lista = [];
  for (const id in est.perguntas) {
    const rev = est.perguntas[id].rev;
    if (rev) lista.push({ id, caixa: rev.caixa, prox: rev.prox });
  }
  return lista;
}

// Registra uma tentativa. `emRevisao` indica resposta dada na revisão espaçada (aí o acerto sobe de caixa).
export function responder(id, escolha, acertou, hoje, emRevisao = false) {
  const r = (est.perguntas[id] ||= { t: [] });
  r.t ||= [];
  r.t.push({ d: hoje, e: escolha, a: acertou ? 1 : 0 });

  if (!acertou) {
    r.rev = { caixa: 1, prox: somarDias(hoje, INTERVALOS[0]) };
  } else if (emRevisao && r.rev) {
    if (r.rev.caixa >= INTERVALOS.length) delete r.rev;
    else {
      r.rev.caixa++;
      r.rev.prox = somarDias(hoje, INTERVALOS[r.rev.caixa - 1]);
    }
  }

  const dia = (est.dias[hoje] ||= [0, 0]);
  dia[0]++;
  if (acertou) dia[1]++;
  salvar();
}

export function favorita(id) {
  return !!est.perguntas[id]?.fav;
}

export function alternarFavorita(id) {
  const r = (est.perguntas[id] ||= { t: [] });
  if (r.fav) delete r.fav;
  else r.fav = true;
  salvar();
  return !!r.fav;
}

export function sessao() {
  return est.sessao;
}

export function definirSessao(s) {
  est.sessao = s;
  salvar();
}

export function simulado() {
  return est.simulado;
}

export function definirSimulado(s) {
  est.simulado = s;
  salvar();
}

export function simulados() {
  return est.simulados;
}

export function guardarNota(nota) {
  est.simulados.push(nota);
  salvar();
}

export function pref(chave, padrao = null) {
  return est.prefs[chave] ?? padrao;
}

export function definirPref(chave, valor) {
  if (valor === null) delete est.prefs[chave];
  else est.prefs[chave] = valor;
  salvar();
}

export function dias() {
  return est.dias;
}

export function totais() {
  let respondidas = 0;
  let acertos = 0;
  for (const d in est.dias) {
    respondidas += est.dias[d][0];
    acertos += est.dias[d][1];
  }
  return { respondidas, acertos };
}
