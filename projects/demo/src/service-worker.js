/**
 * Fakes API Server
 *
 * The default API endpoints set in `environment.ts` are being served by this service worker.
 * This is necessary because the demo app does not ship with a real API server.
 */
let i = 0;
self.addEventListener('fetch', function(event) {
  if (/^https:\/\/api\.domain\.tld\//i.test(event.request.url)) {
    console.log('Fake API response from api.domain.tld using Service Worker')
    event.respondWith(new Response(
      JSON.stringify({
        errors: [
          { message: 'Internal Server Error' }
        ]
      }),
      {
        headers: { 'spa-form-token': 'form-token-' + ++i },
      }
    ));
  }
});