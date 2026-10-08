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
//   simulados: [],
//   prefs: {}
// }
import { somarDias } from './datas.js';

const CHAVE = 'fluidos:v1';
const INTERVALOS = [1, 3, 7, 14, 30];

let est = vazio();

function vazio() {
  return { v: 1, dia1: null, perguntas: {}, dias: {}, sessao: null, simulados: [], prefs: {} };
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

export function vencidas(hoje) {
  let n = 0;
  for (const id in est.perguntas) {
    const rev = est.perguntas[id].rev;
    if (rev && rev.prox <= hoje) n++;
  }
  return n;
}
