const CACHE_NAME = 'hotel-karim-admin-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Network-first strategy for admin pages (always fresh data)
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    // API calls — always go to network
    return;
  }

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
