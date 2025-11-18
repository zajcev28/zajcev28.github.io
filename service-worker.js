self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("game-cache-v1").then(cache => {
            return cache.addAll([
                "./",
                "index.html",
                "game.js",
                "manifest.json"
                // UWAGA: nie dodawaj icon.png jeśli nie istnieje!
            ]).catch(err => {
                console.warn("SW: Cache error:", err);
            });
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(resp => {
            return resp || fetch(event.request);
        })
    );
});
