// this file is needed so that the PWA runs correctly.
// works with pwa-manifest.json


const CACHE_NAME = "forkyeah-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/js/forkyeah-navbar.js",
  "/js/forkyeah-searchbar.js",
  "/js/forkyeah-map.js",
  "/js/forkyeah-infocard.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});