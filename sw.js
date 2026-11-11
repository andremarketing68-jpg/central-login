// Central de Automação — app instalável.
// Sempre busca a versão mais nova na internet; só usa a cópia guardada se estiver sem conexão.
const CACHE = 'central-app-v1';
const BASICOS = ['./index.html', './admin.html', './config.js', './manifest.webmanifest', './icone-192.png', './icone-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASICOS)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;   // Supabase e outros sites: não mexe
  e.respondWith(
    fetch(req).then((resp) => {
      if (resp.ok) { const copia = resp.clone(); caches.open(CACHE).then(c => c.put(req, copia)).catch(() => {}); }
      return resp;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || new Response('Sem conexão com a internet.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })))
  );
});
