// Roteamento por hash: #/inicio, #/estudar, #/revisar, #/resumos, #/mais.
// Cada tela é uma função (raiz, partes) => limpeza opcional.
// `partes` é o resto do caminho: #/revisar/historico/geo-0001 → ['historico', 'geo-0001'].

let rotas = {};
let limpar = null;
const tela = document.getElementById('tela');
const abas = document.querySelectorAll('#abas a');

function rotaAtual() {
  const [nome, ...partes] = location.hash.replace(/^#\/?/, '').split('?')[0].split('/');
  return { nome, partes: partes.filter(Boolean).map(decodeURIComponent) };
}

export function desenhar() {
  const { nome, partes } = rotaAtual();
  if (!rotas[nome]) {
    location.replace('#/inicio');
    return;
  }
  if (typeof limpar === 'function') limpar();
  tela.innerHTML = '';
  limpar = rotas[nome](tela, partes) || null;
  for (const a of abas) {
    if (a.dataset.aba === nome) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  window.scrollTo(0, 0);
}

export function iniciarRouter(tabela) {
  rotas = tabela;
  window.addEventListener('hashchange', desenhar);
  desenhar();
}
