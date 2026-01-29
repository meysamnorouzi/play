// Utility functions for PWA
// Service Worker functionality disabled temporarily due to server MIME type issues

export function registerServiceWorker() {
  // Service Worker registration disabled temporarily
  // Uncomment below to re-enable service worker registration
  /*
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }
  */
}

export function isPWAInstalled(): boolean {
  // Check if running as standalone
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true
  }
  
  // Check iOS standalone
  if ((window.navigator as any).standalone) {
    return true
  }
  
  return false
}

export function isPWASupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window
}