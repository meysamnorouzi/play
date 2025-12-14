import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if running as PWA (iOS)
    if ((window.navigator as any).standalone) {
      setIsInstalled(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Check if already installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const promptInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      return false
    }

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        setIsInstallable(false)
        setDeferredPrompt(null)
        return true
      }
      return false
    } catch (error) {
      console.error('Error installing PWA:', error)
      return false
    }
  }

  return {
    isInstallable,
    isInstalled,
    promptInstall,
  }
}