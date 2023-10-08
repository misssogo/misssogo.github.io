
var CACHE_NAME = 'russian_offline';
var CACHE_URLS = [
  '../favicon.ico',
  'dear.html'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Installed!');
        return cache.addAll(CACHE_URLS);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            let responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseClone);
              });

            return response;
          }
        );
      }).catch(function() {
        // If both fail, show a generic fallback:
        // return caches.match('/offline.html');
        console.error('Offline!');
      })
    );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('Replaced!');
          return caches.delete(key);
        }
      }));
    })
  );
});