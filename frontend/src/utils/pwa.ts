// PWA utility functions

export const isPWAInstalled = (): boolean => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isInWebApp = (navigator as any).standalone === true;
  return isStandalone || isInWebApp;
};

export const isPWASupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

export const getInstallPrompt = (): any => {
  return (window as any).deferredPrompt;
};

export const clearInstallPrompt = (): void => {
  (window as any).deferredPrompt = null;
};