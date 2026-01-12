// Service Worker Registration with Development Mode Detection

export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker not supported');
    return;
  }

  // Disable service worker in development for hot reload
  const isDevelopment = import.meta.env.DEV;

  if (isDevelopment) {
    console.log('Development mode: Unregistering service workers for hot reload');

    // Unregister all service workers in development
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
      console.log('Service worker unregistered');
    }

    // Clear all caches
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
    console.log('All caches cleared');

    return;
  }

  // Production mode: Register service worker
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    console.log('Service Worker registered:', registration);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available, prompt user to refresh
            if (confirm('New version available! Reload to update?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      }
    });

    // Reload page when new service worker takes control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });

  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
};

// Manual function to clear all caches and reload
export const clearCachesAndReload = async () => {
  try {
    // Unregister all service workers
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }

    // Clear all caches
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));

    console.log('All caches cleared and service workers unregistered');

    // Reload the page
    window.location.reload();
  } catch (error) {
    console.error('Error clearing caches:', error);
  }
};

// Check if app is installed as PWA
export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true;
}
