// Marcação de uma pergunta, usada na sessão de estudo e no resultado.
import { unidade } from '../dados.js';
import { esc, rico, corSegura } from '../util.js';

const LETRAS = 'ABCDEFGHIJ';
const DIFICULDADE = { 1: 'Fácil', 2: 'Média', 3: 'Para pensar' };

export function htmlMeta(q) {
  const u = unidade(q.unidade);
  const d = DIFICULDADE[q.dificuldade] ? q.dificuldade : 2;
  return `
    <div class="p-meta">
      <span class="chip" style="--cor:${corSegura(u?.cor)}">${esc(u?.curto || q.unidade)}</span>
      <span class="p-tema">${esc(q.tema)}</span>
      <span class="selo dif-${d}"><i></i><i></i><i></i>${DIFICULDADE[d]}</span>
    </div>`;
}

export function htmlEnunciado(q) {
  const afirmativas = Array.isArray(q.afirmativas) && q.afirmativas.length
    ? `<ul class="afirmativas">${q.afirmativas.map((a) => `<li>${rico(a)}</li>`).join('')}</ul>`
    : '';
  return `
    ${q.tipo === 'incorreta' ? '<p class="p-aviso">Procure a alternativa <strong>incorreta</strong></p>' : ''}
    <h1 class="p-enunciado">${rico(q.enunciado)}</h1>
    ${afirmativas}`;
}

function letra(q, i) {
  return q.tipo === 'vf' ? q.alternativas[i].charAt(0).toUpperCase() : LETRAS[i] || String(i + 1);
}

// `escolha` nulo = ainda não respondida. Respondida: marca a correta (✓) e a escolhida errada (✗).
export function htmlAlternativas(q, escolha = null) {
  const respondida = escolha !== null;
  const botoes = q.alternativas.map((texto, i) => {
    let classe = '';
    let marca = letra(q, i);
    let leitor = '';
    if (respondida && i === q.correta) {
      classe = ' certa';
      marca = '✓';
      leitor = '<span class="so-leitor"> (correta)</span>';
    } else if (respondida && i === escolha) {
      classe = ' errada';
      marca = '✗';
      leitor = '<span class="so-leitor"> (sua resposta, incorreta)</span>';
    }
    return `
      <button type="button" class="alt${classe}" data-i="${i}"${respondida ? ' disabled' : ''}>
        <span class="alt-letra" aria-hidden="true">${marca}</span>
        <span class="alt-texto">${rico(texto)}${leitor}</span>
      </button>`;
  }).join('');
  return `<div class="alts" role="group" aria-label="Alternativas">${botoes}</div>`;
}

export function htmlExplicacao(q, escolha) {
  const acertou = escolha === q.correta;
  return `
    <section class="explica ${acertou ? 'ok' : 'erro'}" aria-live="polite">
      <h2>${acertou ? '✓ Você acertou' : '✗ Você errou'}</h2>
      <p>${rico(q.explicacao)}</p>
    </section>`;
}
