const CACHE_NAME = 'gameacg-v2.0';
const APP_VERSION = '2.0.0';

const urlsToCache = [
  '/gameapp2/',
  '/gameapp2/index.html',
  '/gameapp2/css/styles.css',
  '/gameapp2/js/app.js',
  '/gameapp2/js/cloud-sync.js',
  '/gameapp2/js/review.js',
  '/gameapp2/js/admin.js',
  '/gameapp2/config.json',
  '/gameapp2/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(err => {
          console.log('预缓存部分失败（离线时正常）:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname.includes('/games.json') || url.pathname.includes('cdn.jsdelivr.net')) {
    event.respondWith(
      fetch(request).catch(() => new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' }
      }))
    );
    return;
  }

  if (request.method !== 'GET') return;

  if (url.origin === self.location.origin && url.pathname === '/config.json') {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) {
          const fetched = fetch(request).then(response => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
            }
            return response;
          }).catch(() => cached);
          return fetched;
        }
        return fetch(request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        }).catch(() => {
          if (request.destination === 'document') {
            return caches.match('/gameapp2/index.html');
          }
          return new Response('', { status: 408 });
        });
      })
  );
});
