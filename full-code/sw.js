const CACHE_NAME = 'game-dashboard-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/styles.css',
    '/js/app.js',
    '/js/router.js',
    '/js/store.js',
    '/js/views/homeView.js',
    '/js/views/leaderboardView.js',
    '/js/views/marketView.js',
    '/icons/site.webmanifest',
    '/icons/android-chrome-192x192.png',
    '/icons/android-chrome-512x512.png',
    '/icons/apple-touch-icon.png',
    '/icons/favicon-16x16.png',
    '/icons/favicon-32x32.png',
    '/icons/favicon.ico'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();

    event.waitUntil(async function () {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(URLS_TO_CACHE);
    }());
});

self.addEventListener('activate', (event) => {
    event.waitUntil(async function () {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.filter((cacheName) => {
                return cacheName !== CACHE_NAME;
            }).map((cacheName) => caches.delete(cacheName))
        );
        console.log('Old caches cleared.');
        try {
            await self.clients.claim();
            console.log('Clients claimed.');
        } catch (error) {
            console.error('Error claiming clients:', error);
        }
        console.log('Service worker activated and controlling clients.');
    }());
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        (async () => {
            if (event.request.mode === 'navigate') {
                const cache = await caches.open(CACHE_NAME);
                return cache.match('/index.html');
            }

            // Try to get the response from a cache.
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse) {
                console.log("Found response in cache:", cachedResponse);
                return cachedResponse;
            }

            return fetch(event.request)
                .then(networkResponse => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }
                    cache.put(event.request, networkResponse.clone()); // Clone the response as it can only be read once
                    return networkResponse;
                })
                .catch(() => {
                    console.log('Fetch failed; returning offline page (if any)');
                    return new Response('You are currently offline.', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
        })()
    );
});