// ════════════════════════════════════════════════════════════════════════
// Service Worker — Stammbaum von Brenig
// brenig-Cache: App-Shell (network-first)
// ri-data-Cache: RI-Datenbank-JSONs (cache-first, dauerhaft offline)
//
// WARTUNG:
// · App geändert (index.html etc.)  → CACHE hochzählen (brenig-v5, …)
// · ri_*.json ersetzt              → RI_CACHE hochzählen (ri-data-v16, …)
// ════════════════════════════════════════════════════════════════════════

const CACHE = 'brenig-v4';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

const RI_CACHE = 'ri-data-v15';
const RI_FILES = ['ri_meta.json', 'ri_chunks_a.json', 'ri_chunks_b.json'];

function isRIFile(request) {
  return RI_FILES.includes(new URL(request.url).pathname.split('/').pop());
}

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          // brenig-Cache UND aktuellen RI-Cache verschonen
          .filter(k => k !== CACHE && k !== RI_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // ── RI-Datenbank: cache-first, einmal laden, dauerhaft offline ──
  if (isRIFile(e.request)) {
    e.respondWith(
      caches.open(RI_CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(response => {
            if (response.ok) cache.put(e.request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }
  // ── Alles andere: network-first mit Cache-Fallback (wie bisher) ──
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
