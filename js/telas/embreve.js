import { esc } from '../util.js';

export function telaEmBreve(titulo, descricao) {
  return (raiz) => {
    raiz.innerHTML = `
      <section class="vazio">
        <p class="rotulo">${esc(titulo)}</p>
        <h1>Em breve</h1>
        <p>${esc(descricao)}</p>
      </section>`;
  };
}
