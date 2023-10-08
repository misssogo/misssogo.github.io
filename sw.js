var CACHE_NAME = 'offline_russian';
var CACHE_URLS = [
    '/russian/favicon.ico',
    '/russian/offline.html',
    '/russian/dear.html',
    '/russian/a.mp3',
    '/russian/b.mp3',
    '/russian/v.mp3',
    '/russian/g.mp3',
    '/russian/d.mp3',
    '/russian/ye.mp3',
    '/russian/yo.mp3',
    '/russian/zh.mp3',
    '/russian/z.mp3',
    '/russian/i.mp3',
    '/russian/y.mp3',
    '/russian/k.mp3',
    '/russian/l.mp3',
    '/russian/m.mp3',
    '/russian/n.mp3',
    '/russian/o.mp3',
    '/russian/p.mp3',
    '/russian/r.mp3',
    '/russian/s.mp3',
    '/russian/t.mp3',
    '/russian/oo.mp3',
    '/russian/f.mp3',
    '/russian/kh.mp3',
    '/russian/ts.mp3',
    '/russian/ch.mp3',
    '/russian/sh.mp3',
    '/russian/sshch.mp3',
    '/russian/no_sound.mp3',
    '/russian/iy.mp3',
    '/russian/e.mp3',
    '/russian/you.mp3',
    '/russian/ya.mp3',
    '/russian/play.png',
    '/russian/pause.png'
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
                    if (!response || response.status !== 200 || response.type !== 'basic') {
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
            return caches.match('/russian/offline.html');
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== CACHE_NAME) {
                    console.log('Replaced!');
                    return caches.delete(key);
                }
            }));
        })
    );
});