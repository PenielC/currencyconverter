var cacheName = "offlineConverter";
self.addEventListener("install", function (event) {
    console.log("service worker installed");
    event.waitUntil(
        caches.open(cacheName).then(function (cache) { 
            return cache.addAll(["index.html", "../css/style.css", 
                "https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css",
                "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js",
                "https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js",
                "https://maxcdn.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js",
                "https://free.currencyconverterapi.com/api/v5/countries"
            ]);
        })
    )
})

self.addEventListener("activate", function (event) { 
    console.log("service worker activated")
    event.waitUntil(
        caches.keys().then(function (cacheNames) { 
            return Promise.all(cacheNames.map(function (thisCacheName) { 
                if (thisCacheName !== cacheName) { 
                    console.log("removing cached files from thisCacheName");
                    return caches.delete(thisCacheName);
                }
            }))
        })
    )
})

self.addEventListener("fetch", function (event) { 
    event.respondWith(async function(){
        caches.match(event.request).then(function (response) { 
            if (response) { 
                console.log(event.request.url);
                return response;
            }

            var requestClone = event.request.clone();
            fetch(requestClone)
            .then(function (response) { 
                if (!response) { 
                    console.log("No response from fetch");
                    return response;
                }

                var responseClone = response.clone();
                caches.open(cacheName).then(function (cache) {
                    cache.put(event.request, responseClone);
                    return response;
                });
            })
            .catch(function (err) { 
                    console.log("Error fetching and caching")
            })
        })
      
    })
})