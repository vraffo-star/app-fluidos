// Service worker: casca da app em cache-first (versionada) e data/ em network-first.
// Ao mudar qualquer arquivo da casca, aumente VERSAO para que a atualização chegue aos celulares.
const VERSAO = 'v2';
const CASCA = `fluidos-casca-${VERSAO}`;
const DADOS = 'fluidos-dados';
const ESPERA_REDE_MS = 4000;

const ARQUIVOS = [
  './',
  'manifest.webmanifest',
  'css/app.css',
  'js/app.js',
  'js/router.js',
  'js/store.js',
  'js/dados.js',
  'js/datas.js',
  'js/util.js',
  'js/estudo.js',
  'js/revisao.js',
  'js/telas/inicio.js',
  'js/telas/estudar.js',
  'js/telas/pergunta.js',
  'js/telas/revisar.js',
  'js/telas/espacada.js',
  'js/telas/simulado.js',
  'js/telas/historico.js',
  'js/telas/embreve.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
];

const PASTA_DADOS = new URL('data/', self.registration.scope).pathname;

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const casca = await caches.open(CASCA);
    await casca.addAll(ARQUIVOS.map((u) => new Request(u, { cache: 'reload' })));
    // Os dados entram no cache já na instalação, para a app funcionar offline desde a primeira visita.
    await guardarDadosIniciais().catch(() => {});
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const nomes = await caches.keys();
    await Promise.all(nomes
      .filter((n) => n.startsWith('fluidos-casca-') && n !== CASCA)
      .map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => {
  if (e.data === 'atualizar') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(url.pathname.startsWith(PASTA_DADOS) ? redePrimeiro(req) : cachePrimeiro(req));
});

async function cachePrimeiro(req) {
  const casca = await caches.open(CASCA);
  const guardado = await casca.match(req, { ignoreSearch: true });
  if (guardado) return guardado;
  try {
    return await fetch(req);
  } catch (erro) {
    if (req.mode === 'navigate') {
      const inicio = await casca.match('./');
      if (inicio) return inicio;
    }
    throw erro;
  }
}

async function redePrimeiro(req) {
  const dados = await caches.open(DADOS);
  const guardado = (await dados.match(req)) || (await dados.match(req, { ignoreSearch: true }));
  const rede = fetch(req).then(async (resp) => {
    if (resp.ok) await guardar(dados, req, resp.clone());
    return resp;
  });
  if (!guardado) return rede;
  // Com cópia em cache, não deixa uma rede lenta ou caída travar a abertura.
  return Promise.race([
    rede.then((resp) => (resp.ok ? resp : guardado)).catch(() => guardado),
    new Promise((ok) => setTimeout(() => ok(guardado), ESPERA_REDE_MS)),
  ]);
}

// Guarda a resposta e apaga cópias do mesmo arquivo com outro ?v= (versões antigas dos dados).
async function guardar(dados, req, resp) {
  await dados.put(req, resp);
  const url = new URL(req.url);
  for (const chave of await dados.keys()) {
    const outra = new URL(chave.url);
    if (outra.pathname === url.pathname && outra.search !== url.search) await dados.delete(chave);
  }
}

async function guardarDadosIniciais() {
  const dados = await caches.open(DADOS);
  const reqIndice = new Request('data/indice.json', { cache: 'no-cache' });
  const resp = await fetch(reqIndice);
  if (!resp.ok) return;
  const indice = await resp.clone().json();
  await guardar(dados, reqIndice, resp);
  const caminhos = (indice.unidades || []).flatMap((u) => [u.arquivo, u.resumo]).filter(Boolean);
  await Promise.all(caminhos.map(async (c) => {
    const req = new Request(`data/${c}?v=${indice.versao}`);
    const r = await fetch(req).catch(() => null);
    if (r && r.ok) await guardar(dados, req, r);
  }));
}
