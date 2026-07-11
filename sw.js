// ═══════════════════════════════════════════════════════
//  GENEALOGIA BRENNENSIS — Service Worker v5
//  Offline-First: alle lokalen Ressourcen werden gecacht
//  Strategie: Cache-First für Assets, Network-First für JSON
// ═══════════════════════════════════════════════════════

const CACHE_ASSETS = 'gb-assets-v5';
const CACHE_DATA   = 'gb-data-v5';

// ── Kern-Assets: App-Shell, Bibliotheken, Fonts, Icons ─
const CORE_FILES = [
  './',
  './index.html',
  './manifest.json',

  // Bibliotheken (flach im Root)
  './d3.min.js',
  './fuse.min.js',
  './xlsx.full.min.js',
  './papaparse.min.js',
  './leaflet.min.js',
  './leaflet.min.css',

  // Fonts (flach im Root)
  './cinzel-v26-latin-regular.woff2',
  './cinzel-v26-latin-500.woff2',
  './cinzel-v26-latin-600.woff2',
  './cinzel-v26-latin-700.woff2',
  './cinzel-v26-latin-800.woff2',
  './cinzel-v26-latin-900.woff2',
  './crimson-text-v19-latin-regular.woff2',
  './crimson-text-v19-latin-italic.woff2',
  './crimson-text-v19-latin-600.woff2',
  './crimson-text-v19-latin-600italic.woff2',
  './crimson-text-v19-latin-700.woff2',
  './crimson-text-v19-latin-700italic.woff2',

  // Icons
  './icon-192.png',
  './icon-512.png',
];

// ── RI-Datenbank + große Zusatzdaten: separat gecacht ──
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

  // Siebmacher Preußen
  './siebmacher_preussen_v1.json',
];

// ── Install: Kern-Assets sofort cachen ─────────────────
self.addEventListener('install', event => {
  console.log('[SW] Installing v5...');
  event.waitUntil(
    caches.open(CACHE_ASSETS)
      .then(cache => {
        console.log('[SW] Caching core assets...');
        // Einzeln cachen, damit ein Fehler nicht alles blockiert
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
  console.log('[SW] Activating v5...');
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

// ── Fetch: Cache-First für Assets, Network-First für Daten ─
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Externe URLs (WappenWiki, OSM, APIs, CDN) — immer normal behandeln
  if (url.origin !== self.location.origin) {
    return;
  }

  // RI-Daten & große JSON-Datenbanken: Cache-First, aber im Hintergrund aktualisieren
  const isData = url.pathname.includes('ri_chunk') ||
                 url.pathname.includes('ri_meta') ||
                 url.pathname.includes('wappenrolle') ||
                 url.pathname.includes('siebmacher');

  if (isData) {
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

  // Alles andere (inkl. Vosk-Modell-Teile): Cache-First, Netzwerk als Fallback
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
