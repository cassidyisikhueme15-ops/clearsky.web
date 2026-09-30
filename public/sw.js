const CACHE = "clearsky-5-0-v3-apa-voice-camera";
const CORE = ["/", "/home.html", "/tools.html", "/style.css", "/app.js", "/components/navbar.html", "/js/navbar.js", "/apa.html", "/manifest.json"];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE).then(function (cache) {
            return cache.addAll(CORE);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.filter(function (key) {
                return key !== CACHE;
            }).map(function (key) {
                return caches.delete(key);
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", function (event) {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request).then(function (response) {
            const copy = response.clone();
            caches.open(CACHE).then(function (cache) {
                cache.put(event.request, copy);
            }).catch(function () {});
            return response;
        }).catch(function () {
            return caches.match(event.request);
        })
    );
});
