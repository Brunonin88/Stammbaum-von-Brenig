// ═══════════════════════════════════════════════════════
//  GENEALOGIA BRENNENSIS — Service Worker v3
//  Offline-First: alle lokalen Ressourcen werden gecacht
//  Strategie: Cache-First für Assets, Network-First für JSON
// ═══════════════════════════════════════════════════════

const CACHE_NAME = 'genealogia-brennensis-v3';
const CACHE_ASSETS = 'gb-assets-v3';
const CACHE_DATA   = 'gb-data-v3';

// ── Kern-Assets: immer offline verfügbar ────────────────
const CORE_FILES = [
  './',
  './index.html',
  './manifest.json',

  // JavaScript-Bibliotheken
  './lib/d3.min.js',
  './lib/fuse.min.js',
  './lib/xlsx.full.min.js',
  './lib/papaparse.min.js',
  './lib/leaflet.min.js',
  './lib/leaflet.min.css',

  // Fonts — Cinzel
  './fonts/cinzel-v26-latin-regular.woff2',
  './fonts/cinzel-v26-latin-500.woff2',
  './fonts/cinzel-v26-latin-600.woff2',
  './fonts/cinzel-v26-latin-700.woff2',
  './fonts/cinzel-v26-latin-800.woff2',
  './fonts/cinzel-v26-latin-900.woff2',

  // Fonts — Crimson Text
  './fonts/crimson-text-v19-latin-regular.woff2',
  './fonts/crimson-text-v19-latin-italic.woff2',
  './fonts/crimson-text-v19-latin-600.woff2',
  './fonts/crimson-text-v19-latin-600italic.woff2',
  './fonts/crimson-text-v19-latin-700.woff2',
  './fonts/crimson-text-v19-latin-700italic.woff2',

  // Icons
  './icon-192.png',
  './icon-512.png',
];

// ── RI-Datenbank: groß, separat gecacht ────────────────
const RI_FILES = [
  './ri_meta.json',
  './ri_meta_updated_new.json',
  './ri_chunks_a.json',
  './ri_chunks_b1.json',
  './ri_chunks_b2.json',
  './ri_chunks_c1.json',
  './ri_chunks_c2.json',
  './ri_chunks_d.json',
  './ri_chunks_e.json',
  './ri_chunks_f.json',
  './ri_chunks_g.json',
  './ri_chunks_h.json',
  './ri_chunks_i.json',
  './ri_chunks_j.json',
  './ri_chunks_k.json',
  './ri_chunks_l.json',

  // Codex Gelre Wappendatenbank
  './wappenrolle_gelre_v5_final2.json',
];

// ── Install: Kern-Assets sofort cachen ─────────────────
self.addEventListener('install', event => {
  console.log('[SW] Installing v3...');
  event.waitUntil(
    caches.open(CACHE_ASSETS)
      .then(cache => {
        console.log('[SW] Caching core assets...');
        // Einzeln cachen damit ein Fehler nicht alles blockiert
        return Promise.allSettled(
          CORE_FILES.map(url =>
            cache.add(url).catch(err =>
              console.warn('[SW] Konnte nicht cachen:', url, err.message)
            )
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// ── Activate: alten Cache aufräumen ────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activating v3...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_ASSETS && k !== CACHE_DATA)
          .map(k => {
            console.log('[SW] Alten Cache löschen:', k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: Cache-First für Assets, passthrough für extern
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Externe URLs (WappenWiki, OSM, APIs) — immer Netzwerk
  if (url.origin !== self.location.origin) {
    return; // Browser behandelt normal
  }

  // RI-Daten: Cache-First, aber im Hintergrund aktualisieren
  if (url.pathname.includes('ri_chunk') ||
      url.pathname.includes('ri_meta') ||
      url.pathname.includes('wappenrolle')) {
    event.respondWith(
      caches.open(CACHE_DATA).then(cache =>
        cache.match(event.request).then(cached => {
          const networkFetch = fetch(event.request)
            .then(response => {
              if (response.ok) cache.put(event.request, response.clone());
              return response;
            })
            .catch(() => cached);
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  // Alles andere: Cache-First
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          caches.open(CACHE_ASSETS).then(cache =>
            cache.put(event.request, response.clone())
          );
        }
        return response;
      }).catch(() => {
        // Offline-Fallback für Navigation
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// ── Message: manuelle Cache-Kontrolle ──────────────────
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();

  // RI-Datenbank vorab cachen (vom "Offline vorbereiten"-Button)
  if (event.data === 'PREFETCH_RI') {
    caches.open(CACHE_DATA).then(cache => {
      Promise.allSettled(
        RI_FILES.map(url =>
          fetch(url).then(r => {
            if (r.ok) cache.put(url, r);
          }).catch(err =>
            console.warn('[SW] RI prefetch fehlgeschlagen:', url)
          )
        )
      ).then(() => {
        event.source.postMessage('RI_PREFETCH_DONE');
      });
    });
  }
});
