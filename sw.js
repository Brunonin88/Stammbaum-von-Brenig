/* ═══════════════════════════════════════════════════════════════
   Genealogia Brennensis · Service Worker
   App-Version : v48y
   Cache-Version: v48y-chunks-l
   Chunk-Dateien: ri_chunks_a.json … ri_chunks_l.json  (12 Dateien)
   Letzte Änderung: 2026-06-16
═══════════════════════════════════════════════════════════════ */

const CACHE_NAME = 'genealogia-v48z-grav1';

const CORE_ASSETS = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
];

const DATA_ASSETS = [
  'ri_meta.json',
  'ri_quellendichte.json',
  'ri_index_a.json',
  'ri_index_b.json',
  'ri_index_c.json',
  'ri_index_d.json',
  'ri_index_e.json',
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
  'ri_chunks_l.json'
];

/* ── INSTALL: Core-Assets sofort cachen, Daten optional ── */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Core-Assets: müssen gelingen
      return cache.addAll(CORE_ASSETS).then(function() {
        // Daten-Assets: einzeln, Fehler werden ignoriert
        // (nicht alle Chunks müssen beim ersten Install da sein)
        return Promise.all(
          DATA_ASSETS.map(function(url) {
            return cache.add(url).catch(function(err) {
              console.warn('[SW] Konnte nicht cachen: ' + url, err);
            });
          })
        );
      });
    }).then(function() {
      // Sofort übernehmen, kein Warten auf Tab-Neustart
      return self.skipWaiting();
    })
  );
});

/* ── ACTIVATE: Alte Caches löschen ── */
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

/* ── FETCH: Cache-first für Daten, Network-first für alles andere ── */
self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  // Nur GET-Requests behandeln
  if (event.request.method !== 'GET') return;

  // ri_chunks_*.json und ri_meta.json: Cache-first (groß, unveränderlich)
  if (url.indexOf('ri_chunks_') !== -1 || url.indexOf('ri_meta') !== -1) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        if (cached) return cached;
        // Nicht im Cache: aus dem Netz laden und cachen
        return fetch(event.request).then(function(response) {
          if (response && response.status === 200) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, clone);
            });
          }
          return response;
        }).catch(function() {
          // Offline und nicht gecacht: leere 503-Antwort
          return new Response('{"error":"offline"}', {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
    );
    return;
  }

  // Leaflet und externe CDN-Ressourcen: Cache-first
  if (url.indexOf('cdnjs.cloudflare.com') !== -1) {
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

  // Alles andere (index.html etc.): Network-first, Cache als Fallback
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
