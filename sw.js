const CACHE = 'secure-messenger-v2.0';
const CORE = [
  './',
  './index.html',
  './app.js',
  './manifest.webmanifest',
  './offline.html'
];

// Install: Cache core assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => {
        console.log('[SW] Caching core assets');
        return cache.addAll(CORE);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.error('[SW] Install failed:', err))
  );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => {
          console.log('[SW] Deleting old cache:', k);
          return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Network-first for HTML (always get fresh auth state)
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => 
          caches.match(request)
            .then(cached => cached || caches.match('./offline.html'))
        )
    );
    return;
  }

  // Cache-first for static assets (JS, CSS, images)
  if (['script', 'style', 'image', 'font'].includes(request.destination)) {
    event.respondWith(
      caches.match(request)
        .then(cached => {
          if (cached) {
            // Return cached, but update in background
            fetch(request).then(response => {
              caches.open(CACHE).then(cache => cache.put(request, response));
            }).catch(() => {}); // Silent fail for background update
            return cached;
          }
          // Not in cache, fetch and cache
          return fetch(request).then(response => {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
            return response;
          });
        })
    );
    return;
  }

  // Default: network-only (for API calls, Firebase, etc.)
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});