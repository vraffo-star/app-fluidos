import * as store from './store.js';
import { carregarDados } from './dados.js';
import { hoje, dataSimulada, ddmmaaaa } from './datas.js';
import { iniciarRouter, desenhar } from './router.js';
import { telaInicio } from './telas/inicio.js';
import { telaEstudar } from './telas/estudar.js';
import { telaRevisar } from './telas/revisar.js';
import { telaResumos } from './telas/resumos.js';
import { telaMais } from './telas/mais.js';

const tela = document.getElementById('tela');

async function iniciar() {
  store.carregar();
  if (store.primeiraAbertura(hoje())) {
    // Pede ao navegador para não apagar os dados (não abre nenhum diálogo no Android).
    navigator.storage?.persist?.().catch(() => {});
  }

  if (dataSimulada()) {
    const faixa = document.getElementById('faixa-teste');
    faixa.textContent = `Modo de teste — data simulada: ${ddmmaaaa(dataSimulada())}`;
    faixa.hidden = false;
  }

  try {
    await carregarDados();
  } catch (erro) {
    console.error(erro);
    tela.innerHTML = `
      <section class="vazio">
        <h1>Não foi possível carregar o conteúdo</h1>
        <p>Verifique a conexão e tente de novo. Depois da primeira carga, a app funciona sem internet.</p>
        <button class="btn primario" type="button" id="tentar">Tentar de novo</button>
      </section>`;
    document.getElementById('tentar').addEventListener('click', () => location.reload());
    return;
  }

  iniciarRouter({
    inicio: telaInicio,
    estudar: telaEstudar,
    revisar: telaRevisar,
    resumos: telaResumos,
    mais: telaMais,
  });

  // Ao voltar para a app em outro dia, refaz a tela (pendentes, racha, revisões vencidas).
  let diaDesenhado = hoje();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && hoje() !== diaDesenhado) {
      diaDesenhado = hoje();
      desenhar();
    }
  });
}

function registrarServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  const sw = navigator.serviceWorker;
  const tinhaControle = !!sw.controller;
  const aviso = document.getElementById('aviso-atualizacao');

  sw.register('sw.js').then((reg) => {
    const avisar = () => {
      if (!reg.waiting || !sw.controller) return;
      aviso.hidden = false;
      aviso.onclick = () => {
        aviso.disabled = true;
        reg.waiting?.postMessage('atualizar');
      };
    };
    avisar();
    reg.addEventListener('updatefound', () => {
      const novo = reg.installing;
      novo?.addEventListener('statechange', () => {
        if (novo.state === 'installed') avisar();
      });
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') reg.update().catch(() => {});
    });
  }).catch(() => {});

  let recarregou = false;
  sw.addEventListener('controllerchange', () => {
    if (!tinhaControle || recarregou) return;
    recarregou = true;
    location.reload();
  });
}

iniciar();
registrarServiceWorker();
