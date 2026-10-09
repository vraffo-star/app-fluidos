// Mais › Flashcards: escolher unidades, embaralhar, tocar para virar, "Sabia" / "Não sabia".
// Os "Não sabia" voltam para o fim da fila até serem sabidos. Nada disto é gravado.
import { listaUnidades, unidade } from '../dados.js';
import { esc, rico, corSegura, embaralhar, plural } from '../util.js';

export function telaFlashcards(raiz, partes) {
  const todas = listaUnidades();
  let escolhidas = new Set(partes[0] && unidade(partes[0]) ? [partes[0]] : todas.map((u) => u.id));

  let fila = [];
  let total = 0;
  let voltaram = new Set();
  let virado = false;

  const cartoes = (ids) => todas.filter((u) => ids.has(u.id))
    .flatMap((u) => (u.flashcards || []).map((c) => ({ ...c, unidade: u.id })));

  function comecar(lista) {
    fila = embaralhar(lista);
    total = fila.length;
    voltaram = new Set();
    virado = false;
    rodada();
    window.scrollTo(0, 0);
  }

  function entrada() {
    const tudo = escolhidas.size === todas.length;
    const n = cartoes(escolhidas).length;
    raiz.innerHTML = `
      <div class="sessao-topo"><a class="voltar" href="#/mais">‹ Mais</a></div>
      <header class="cabeca">
        <p class="rotulo">Flashcards</p>
        <h1>Escolha as unidades</h1>
      </header>
      <div class="filtro" role="group" aria-label="Unidades">
        <button type="button" class="ficha" data-u="" aria-pressed="${tudo}">Todas</button>
        ${todas.map((u) => `
          <button type="button" class="ficha com-cor" data-u="${esc(u.id)}" style="--cor:${corSegura(u.cor)}"
                  aria-pressed="${!tudo && escolhidas.has(u.id)}">${esc(u.curto)} <small class="num">${(u.flashcards || []).length}</small></button>`).join('')}
      </div>
      <section class="cartao dia">
        <p class="dia-texto"><span class="num">${n}</span> ${plural(n, 'cartão', 'cartões')}</p>
        <p class="nota">Os cartões vêm embaralhados. Toque no cartão para ver a resposta; os que você marcar "Não sabia" voltam no fim da rodada.</p>
        <button class="btn primario grande" type="button" id="comecar"${n ? '' : ' disabled'}>Começar</button>
      </section>`;

    raiz.querySelector('.filtro').addEventListener('click', (e) => {
      const ficha = e.target.closest('.ficha');
      if (!ficha) return;
      const id = ficha.dataset.u;
      // Mesmo comportamento do filtro de Revisar: partindo de "todas", tocar numa unidade fica só com ela.
      if (!id) escolhidas = new Set(todas.map((u) => u.id));
      else if (escolhidas.size === todas.length) escolhidas = new Set([id]);
      else {
        if (escolhidas.has(id)) escolhidas.delete(id);
        else escolhidas.add(id);
        if (!escolhidas.size) escolhidas = new Set(todas.map((u) => u.id));
      }
      entrada();
    });
    raiz.querySelector('#comecar').addEventListener('click', () => comecar(cartoes(escolhidas)));
  }

  function rodada() {
    if (!fila.length) {
      fim();
      return;
    }
    const c = fila[0];
    const u = unidade(c.unidade);
    const feitos = total - fila.length;

    raiz.innerHTML = `
      <div class="sessao-topo">
        <button type="button" class="voltar" id="sair">‹ Sair</button>
        <div class="barra" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${feitos}" aria-label="Cartões sabidos">
          <span style="width:${(feitos / total) * 100}%"></span>
        </div>
        <span class="num sessao-conta">${feitos}/${total}</span>
      </div>
      <button type="button" class="flash${virado ? ' virado' : ''}" id="cartao" style="--cor:${corSegura(u?.cor)}"
              aria-label="${virado ? 'Resposta. Toque para ver a pergunta de novo.' : 'Pergunta. Toque para ver a resposta.'}">
        <span class="flash-topo">
          <span class="chip">${esc(u?.curto || '')}</span>
          <span class="rotulo">${virado ? 'Resposta' : 'Pergunta'}</span>
        </span>
        ${virado
          ? `<span class="flash-frente-menor">${rico(c.frente)}</span><span class="flash-texto verso">${rico(c.verso)}</span>`
          : `<span class="flash-texto">${rico(c.frente)}</span>`}
        <span class="flash-dica">${virado ? 'Toque para voltar à pergunta' : 'Toque para virar'}</span>
      </button>
      ${virado ? `
        <div class="acao-fixa dupla iguais">
          <button class="btn grande nao" type="button" id="nao"><span aria-hidden="true">✗</span> Não sabia</button>
          <button class="btn grande sim" type="button" id="sim"><span aria-hidden="true">✓</span> Sabia</button>
        </div>` : ''}`;

    raiz.querySelector('#cartao').addEventListener('click', () => { virado = !virado; rodada(); });
    raiz.querySelector('#sair').addEventListener('click', () => { entrada(); window.scrollTo(0, 0); });
    raiz.querySelector('#sim')?.addEventListener('click', () => {
      fila.shift();
      virado = false;
      rodada();
      window.scrollTo(0, 0);
    });
    raiz.querySelector('#nao')?.addEventListener('click', () => {
      voltaram.add(c.id);
      fila.push(fila.shift());
      virado = false;
      rodada();
      window.scrollTo(0, 0);
    });
  }

  function fim() {
    const n = voltaram.size;
    const repetir = cartoes(escolhidas).filter((c) => voltaram.has(c.id));
    raiz.innerHTML = `
      <section class="resultado">
        <p class="rotulo">Flashcards</p>
        <h1>Rodada concluída</h1>
        <div class="placar dois">
          <div><span class="num">${total - n}/${total}</span><small>sabia de primeira</small></div>
          <div><span class="num">${n}</span><small>${plural(n, 'precisou voltar', 'precisaram voltar')}</small></div>
        </div>
        <div class="botoes">
          ${n ? `<button class="btn primario grande" type="button" id="so-erradas">Repetir ${plural(n, 'o que não sabia', `os ${n} que não sabia`)}</button>` : ''}
          <button class="btn grande" type="button" id="de-novo">Outra rodada completa</button>
          <a class="btn grande" href="#/mais">Voltar para Mais</a>
        </div>
      </section>`;
    raiz.querySelector('#so-erradas')?.addEventListener('click', () => comecar(repetir));
    raiz.querySelector('#de-novo').addEventListener('click', () => comecar(cartoes(escolhidas)));
  }

  entrada();
}
