var CACHE_NAME = 'russian_assets';
var CACHE_URLS = [
    '/dear.html',
    '/offline.html',
    '/a.mp3',
    '/b.mp3',
    '/v.mp3',
    '/g.mp3',
    '/d.mp3',
    '/ye.mp3',
    '/yo.mp3',
    '/zh.mp3',
    '/z.mp3',
    '/i.mp3',
    '/y.mp3',
    '/k.mp3',
    '/l.mp3',
    '/m.mp3',
    '/n.mp3',
    '/o.mp3',
    '/p.mp3',
    '/r.mp3',
    '/s.mp3',
    '/t.mp3',
    '/oo.mp3',
    '/f.mp3',
    '/kh.mp3',
    '/ts.mp3',
    '/ch.mp3',
    '/sh.mp3',
    '/sshch.mp3',
    '/no_sound.mp3',
    '/iy.mp3',
    '/e.mp3',
    '/you.mp3',
    '/ya.mp3'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Installed!');
                return cache.addAll(CACHE_URLS);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== CACHE_NAME) {
                    console.log('Replaced!');
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }

                return fetch(event.request).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    let responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseClone);
                        });

                    return response;
                });
            }).catch(() => {
                return caches.match('/offline.html');
            })
    );
});