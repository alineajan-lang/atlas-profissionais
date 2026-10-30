/* Atlas · Profissionais: guarda só os arquivos do app (casca). Dados de pacientes nunca ficam no aparelho. */
var V = "atlas-prof-v1";
var CASCA = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(V).then(function (c) { return c.addAll(CASCA); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then(function (r) { var cp = r.clone(); caches.open(V).then(function (c) { c.put(req, cp); }); return r; }).catch(function () { return caches.match(req).then(function (m) { return m || caches.match("./index.html"); }); }));
});
