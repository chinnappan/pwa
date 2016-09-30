var dataCacheName = 'muthu-v1';
var cacheName = 'clita-v2';
var filesToCache = [
  './',
  './index.html',
  './styles/inline.css',
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
         console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  var dataUrl = 'https://chinnappan.github.io/pwa/optional2/json.html';   
  console.log('aarshia== '+ e.request.url + '=====' + e.request.url.indexOf(dataUrl));
  if (e.request.url.indexOf(dataUrl) > -1) {
	console.log('[ServiceWorker] Fetched&Cached Data outer');
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          return caches.open(dataCacheName).then(function(cache) {
            cache.put(e.request.url, response.clone());
            console.log('[ServiceWorker] Fetched&Cached Data');
            return response;
          });
        })
    );
  } else {
	console.log('[ServiceWorker] Fetched&Cached Data inner');
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
