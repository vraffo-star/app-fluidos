// Regras da aba Estudar: quantas perguntas novas estão pendentes e como a sessão é montada.
import * as store from './store.js';
import { dadosIndice, listaUnidades, pergunta, todasPerguntas } from './dados.js';
import { hoje, diasEntre, somarDias } from './datas.js';
import { embaralhar } from './util.js';

export const TAM_SESSAO = 25;
const ALVO_DIFICULDADE = { 1: 0.30, 2: 0.45, 3: 0.25 };

export function naoVistas() {
  return todasPerguntas().filter((q) => !store.foiVista(q.id));
}

// 25 × (dias desde o dia 1 + 1) − novas já respondidas, limitado ao que existe no banco.
export function pendentes() {
  const dias = Math.max(0, diasEntre(store.dia1(), hoje()));
  const meta = (dadosIndice().novasPorDia || 25) * (dias + 1);
  return Math.max(0, Math.min(meta - store.totalVistas(), naoVistas().length));
}

export function bancoEsgotado() {
  return naoVistas().length === 0;
}

// Reparte `total` em partes inteiras proporcionais aos pesos (método dos maiores restos).
function repartir(total, pesos) {
  const soma = pesos.reduce((a, b) => a + b, 0) || 1;
  const exatas = pesos.map((p) => (total * p) / soma);
  const partes = exatas.map(Math.floor);
  let falta = total - partes.reduce((a, b) => a + b, 0);
  const ordem = exatas.map((x, i) => [x - partes[i], i]).sort((a, b) => b[0] - a[0]);
  for (const [, i] of ordem) {
    if (falta-- <= 0) break;
    partes[i]++;
  }
  return partes;
}

// Devolve os ids de uma sessão nova: unidades em round-robin ponderado pelas não vistas,
// dificuldades perto do alvo (conforme houver) e ordem final aleatória.
export function montarSessao(tamanho = Math.min(TAM_SESSAO, pendentes())) {
  const livres = naoVistas();
  const n = Math.min(tamanho, livres.length);
  if (n <= 0) return [];

  const grupos = new Map(listaUnidades().map((u) => [u.id, { 1: [], 2: [], 3: [] }]));
  for (const q of embaralhar(livres)) {
    const d = ALVO_DIFICULDADE[q.dificuldade] ? q.dificuldade : 2;
    grupos.get(q.unidade)[d].push(q);
  }

  const ids = [...grupos.keys()];
  const estoque = (id) => [1, 2, 3].reduce((s, d) => s + grupos.get(id)[d].length, 0);
  const cotas = repartir(n, ids.map(estoque));
  const [f, m, p] = repartir(n, [ALVO_DIFICULDADE[1], ALVO_DIFICULDADE[2], ALVO_DIFICULDADE[3]]);
  const falta = { 1: f, 2: m, 3: p };

  const escolhidas = [];
  while (escolhidas.length < n) {
    let avancou = false;
    ids.forEach((id, i) => {
      if (cotas[i] <= 0) return;
      const g = grupos.get(id);
      const d = [1, 2, 3]
        .filter((x) => g[x].length)
        .sort((a, b) => falta[b] - falta[a] || g[b].length - g[a].length)[0];
      if (!d) { cotas[i] = 0; return; }
      escolhidas.push(g[d].pop());
      falta[d]--;
      cotas[i]--;
      avancou = true;
    });
    if (!avancou) break;
  }
  return embaralhar(escolhidas).map((q) => q.id);
}

// Sessão salva sem as perguntas que saíram dos dados: o total, a posição e as respostas
// passam a contar só as que existem. Se não sobrar nenhuma, a sessão é descartada.
export function sessaoAtual() {
  const s = store.sessao();
  if (!s) return null;
  const vivos = s.ids.filter((id) => pergunta(id));
  if (vivos.length !== s.ids.length) {
    s.pos = s.ids.slice(0, s.pos).filter((id) => pergunta(id)).length;
    s.ids = vivos;
    for (const id in s.resp) if (!pergunta(id)) delete s.resp[id];
    store.definirSessao(vivos.length ? s : null);
  }
  return vivos.length ? s : null;
}

// Racha: dias seguidos com pelo menos 1 pergunta respondida.
// A racha atual continua valendo se hoje ainda não estudou mas ontem sim.
export function racha() {
  const dias = store.dias();
  const estudou = (d) => (dias[d]?.[0] || 0) > 0;

  let maior = 0;
  let seq = 0;
  let anterior = null;
  for (const d of Object.keys(dias).filter(estudou).sort()) {
    seq = anterior && diasEntre(anterior, d) === 1 ? seq + 1 : 1;
    if (seq > maior) maior = seq;
    anterior = d;
  }

  let atual = 0;
  let d = estudou(hoje()) ? hoje() : somarDias(hoje(), -1);
  while (estudou(d)) {
    atual++;
    d = somarDias(d, -1);
  }
  return { atual, maior, estudouHoje: estudou(hoje()) };
}
