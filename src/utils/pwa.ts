/**
 * PWA utility functions
 * Service worker registration is handled by vite-plugin-pwa (virtual:pwa-register/react)
 */

export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false
  // Check if running as standalone (installed PWA)
  if (window.matchMedia('(display-mode: standalone)').matches) return true
  // Check iOS standalone mode
  if ((window.navigator as Navigator & { standalone?: boolean }).standalone) return true
  // Check for display-mode: fullscreen or minimal-ui (alternative PWA modes)
  if (window.matchMedia('(display-mode: fullscreen)').matches) return true
  if (window.matchMedia('(display-mode: minimal-ui)').matches) return true
  return false
}

export function isPWASupported(): boolean {
  if (typeof window === 'undefined') return false
  return 'serviceWorker' in navigator
}

export function canInstallPWA(): boolean {
  return isPWASupported() && !isPWAInstalled()
}
