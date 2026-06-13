const assetcache = 'v2-20260613a';
const assets = [
  'login.php',
  'index.php',
  './manifest.json',
  './js/main.js',
  './js/index.js',
  './js/login.js',
  './js/push.js',
  './css/index.css',
  './images/icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(assetcache)
      .then(cache => cache.addAll(assets))
      .then(() => self.skipWaiting())
  );
});
 
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names =>
      Promise.all(
        names
          .filter(name => name !== assetcache)
          .map(name => caches.delete(name)) 
      )
    ) 
  ); 
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request)
    ) 
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || './index.php';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
