/* ═══════════════════════════════════════════════════════════════
   Genealogia Brennensis · Service Worker
   App-Version : v50_offline
   Cache-Version: genealogia-v50-offline
   Datum       : 2026-06-28
   Fonts       : lokal aus fonts/ (Cinzel v26 + Crimson Text v19)
   Bibliotheken: lokal aus lib/
   RI-Daten    : lokal aus Hauptverzeichnis (ohne ri_index_e.json)
   Wappenrolle : wappenrolle_gelre_v5_final2.json
═══════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'genealogia-v50-offline';

// ── Lokale Core-Assets (müssen vorhanden sein) ─────────────
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  // ── Bibliotheken (lokal) ──
  './lib/d3.min.js',
  './lib/fuse.min.js',
  './lib/xlsx.full.min.js',
  './lib/papaparse.min.js',
  './lib/leaflet.min.css',
  './lib/leaflet.min.js',
  // ── Cinzel (Version 26) ──
  './fonts/cinzel-v26-latin-regular.woff2',
  './fonts/cinzel-v26-latin-500.woff2',
  './fonts/cinzel-v26-latin-600.woff2',
  './fonts/cinzel-v26-latin-700.woff2',
  './fonts/cinzel-v26-latin-800.woff2',
  './fonts/cinzel-v26-latin-900.woff2',
  // ── Crimson Text (Version 19) ──
  './fonts/crimson-text-v19-latin-regular.woff2',
  './fonts/crimson-text-v19-latin-italic.woff2',
  './fonts/crimson-text-v19-latin-600.woff2',
  './fonts/crimson-text-v19-latin-600italic.woff2',
  './fonts/crimson-text-v19-latin-700.woff2',
  './fonts/crimson-text-v19-latin-700italic.woff2'
];

// ── Große Daten-Assets (optional, werden einzeln versucht) ──
const DATA_ASSETS = [
  'ri_meta.json',
  'ri_quellendichte.json',
  'ri_index_a.json',
  'ri_index_b.json',
  'ri_index_c.json',
  'ri_index_d.json',
  // 'ri_index_e.json' existiert nicht – auskommentiert
  'ri_index_f.json',
  'ri_index_g.json',
  'ri_index_h.json',
  'ri_index_i.json',
  'ri_index_j.json',
  'ri_chunks_a.json',
  'ri_chunks_b1.json',
  'ri_chunks_b2.json',
  'ri_chunks_c1.json',
  'ri_chunks_c2.json',
  'ri_chunks_d.json',
  'ri_chunks_e.json',
  'ri_chunks_f.json',
  'ri_chunks_g.json',
  'ri_chunks_h.json',
  'ri_chunks_i.json',
  'ri_chunks_j.json',
  'ri_chunks_k.json',
  'ri_chunks_l.json',
  // ── Wappenrolle (vorhanden) ──
  'wappenrolle_gelre_v5_final2.json'
];

// ── Install: Core sofort, Daten mit Fehlertoleranz ─────────
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CORE_ASSETS).then(function() {
        // Daten-Assets einzeln laden (Fehler ignorieren)
        return Promise.all(
          DATA_ASSETS.map(function(url) {
            return cache.add(url).catch(function(err) {
              console.warn('[SW] Konnte nicht cachen: ' + url, err);
            });
          })
        );
      });
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// ── Aktivieren: alte Caches löschen ──────────────────────────
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== CACHE_NAME;
        }).map(function(key) {
          console.log('[SW] Lösche alten Cache: ' + key);
          return caches.delete(key);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// ── Fetch: Cache-first für Daten, Network-first für Rest ────
self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  if (event.request.method !== 'GET') return;

  // 1. RI-Chunks, Metadaten und Wappenrolle: Cache-first
  if (url.indexOf('ri_chunks_') !== -1 || 
      url.indexOf('ri_meta') !== -1 || 
      url.indexOf('ri_index_') !== -1 || 
      url.indexOf('ri_quellendichte') !== -1 ||
      url.indexOf('wappenrolle_gelre_v5_final2.json') !== -1) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        return fetch(event.request).then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, clone);
            });
          }
          return response;
        }).catch(function() {
          return new Response('{"error":"offline"}', {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
    );
    return;
  }

  // 2. Lokale Assets (lib/, fonts/) – Cache-first
  if (url.indexOf('/lib/') !== -1 || url.indexOf('/fonts/') !== -1) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        return cached || fetch(event.request).then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, clone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // 3. Alles andere: Network-first mit Cache-Fallback
  event.respondWith(
    fetch(event.request).then(function(response) {
      if (response && response.status === 200) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });
      }
      return response;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});
