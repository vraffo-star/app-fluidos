// Leitura de data/ (somente leitura). O índice diz quais unidades existem.

let indice = null;
let unidades = [];
const porId = new Map();
let perguntas = [];

async function lerJson(url, opcoes) {
  const resp = await fetch(url, opcoes);
  if (!resp.ok) throw new Error(`${url}: HTTP ${resp.status}`);
  return resp.json();
}

function valida(p) {
  return p && typeof p.id === 'string' && Array.isArray(p.alternativas)
    && Number.isInteger(p.correta) && p.correta >= 0 && p.correta < p.alternativas.length;
}

export async function carregarDados() {
  indice = await lerJson('data/indice.json', { cache: 'no-cache' });
  unidades = (indice.unidades || []).slice().sort((a, b) => a.ordem - b.ordem);
  porId.clear();
  perguntas = [];

  const carregadas = await Promise.all(unidades.map(async (u) => {
    try {
      return await lerJson(`data/${u.arquivo}?v=${indice.versao}`);
    } catch (erro) {
      console.warn('Unidade não carregada:', u.id, erro);
      return null;
    }
  }));

  unidades = unidades.filter((u, i) => carregadas[i]);
  carregadas.filter(Boolean).forEach((conteudo, i) => {
    const u = unidades[i];
    u.flashcards = conteudo.flashcards || [];
    for (const p of conteudo.perguntas || []) {
      if (!valida(p) || porId.has(p.id)) {
        console.warn('Pergunta ignorada (inválida ou repetida):', p?.id);
        continue;
      }
      const q = { ...p, unidade: u.id };
      porId.set(q.id, q);
      perguntas.push(q);
    }
  });

  if (!unidades.length) throw new Error('Nenhuma unidade pôde ser carregada');
}

export function dadosIndice() {
  return indice;
}

export function listaUnidades() {
  return unidades;
}

export function unidade(id) {
  return unidades.find((u) => u.id === id) || null;
}

export function todasPerguntas() {
  return perguntas;
}

export function pergunta(id) {
  return porId.get(id) || null;
}
