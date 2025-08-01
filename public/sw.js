// Service Worker for PWA and cache management
const CACHE_NAME = `sciolabs-v${Date.now()}`;
const urlsToCache = [
  '/',
  '/manifest.json',
  '/offline',
  '/favicon.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell')
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        console.log('Service Worker installed')
        self.skipWaiting()
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName.startsWith('sciolabs-v')) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated')
      self.clients.claim()
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip admin and API routes from caching
  if (event.request.url.includes('/admin') || 
      event.request.url.includes('/api') ||
      event.request.url.includes('chrome-extension')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then((fetchResponse) => {
          // Don't cache if not a valid response
          if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
            return fetchResponse;
          }

          // Clone the response
          const responseToCache = fetchResponse.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return fetchResponse;
        }).catch(() => {
          // Return offline page if available
          if (event.request.destination === 'document') {
            return caches.match('/offline');
          }
        });
      })
  );
});

// Handle background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync event')
    // Handle offline form submissions here
  }
});

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/'
      },
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/icons/icon-96x96.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icons/icon-96x96.png'
        }
      ]
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'view') {
    const url = event.notification.data.url || '/'
    event.waitUntil(
      clients.openWindow(url)
    )
  }
});
