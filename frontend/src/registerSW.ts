import { registerSW } from "virtual:pwa-register";

export const registerServiceWorker = () => {
  if (import.meta.env.DEV) {
    return;
  }

  registerSW({
    immediate: true,
    onRegisterError(error) {
      console.error("Service worker registration failed:", error);
    },
  });
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
