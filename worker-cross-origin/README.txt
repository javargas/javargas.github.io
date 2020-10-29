Goals: Determine ITP behavior in the following scenarios (simulate google.com/amp):
- Is cookie access blocked in a cross-origin iframe nested 2 levels deep, even if user has interacted w/ that origin in a 1st-party context?
  Note: for an accurate test, all 3 levels must have different origins from each other
 (for AMP: it's 1. https://google.com, 2. https://www-SITE-com.cdn.ampproject.org, 3. https://subscribe.SITE.com).
  NOTE: For AMP, it's the CDN page (not the top window) that opens the popup to subscribe.SITE.com
- If a ServiceWorker is installed for an origin in a 1st-party context, and that worker can access that origin's cookies, are these all possible?
  - NOTE: ServiceWorker cannot access client cookies.
  - A cross-origin 2-level deep iframe can communicate with the ServiceWorker?
  - The same iframe can retrieve a cookie value via the ServiceWorker via postMessage?


Misc
Testing ServiceWorker in Chrome with self-signed cert:
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --user-data-dir=/tmp/chrome-tmp --ignore-certificate-errors
