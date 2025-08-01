// Utility functions for cache management

export function generateCacheBuster() {
  return process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_BUILD_TIME || Date.now()
    : Date.now();
}

export function addCacheBuster(url: string) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${generateCacheBuster()}`;
}

// Force reload utility
export function forceReload() {
  if (typeof window !== 'undefined') {
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    
    // Hard reload
    window.location.reload();
  }
}

// Check for updates
export function checkForUpdates() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update();
    });
  }
}
