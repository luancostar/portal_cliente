const CACHE_NAME = "app-cache-v2"; // Alterado para garantir que versões antigas não causem problemas
const urlsToCache = ["/", "/index.html"];

// Instala o Service Worker e adiciona arquivos ao cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Cache aberto");
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error("[Service Worker] Falha ao adicionar arquivos ao cache", error);
      })
  );
});

// Intercepta as requisições e responde com cache ou busca na rede
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request).catch(() => {
          console.error("[Service Worker] Erro ao buscar:", event.request.url);
          return new Response("Erro ao carregar o recurso.", {
            status: 408,
            statusText: "Network Error",
          });
        });
      })
  );
});

// Atualiza o cache ao ativar um novo Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Deletando cache antigo:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
