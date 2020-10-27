let n = 0;  // this gets reset whenever the browser stops the worker (unrelated; just a test)

self.addEventListener('activate', e => {
  console.log('worker activated');
  e.waitUntil(self.clients.claim());
});

self.addEventListener('message', e => {
  console.log('Handling message event:', e.data);
  let prom = new Promise(res => {
    // synchronous cookies aren't accessible; async access are a draft API. We may need to intercept `fetch` of read_auth and cache it
    //e.ports[0].postMessage({cookie: document.cookie});
    e.ports[0].postMessage({val: (n++)});
    res();
  }).catch(err => {
    e.ports[0].postMessage({error: err.toString()});
  });

  e.waitUntil(prom);
});
