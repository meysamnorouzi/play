import { useEffect, useState } from 'react'

interface UpdateSWResult {
  needRefresh: boolean
  offlineReady: boolean
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>
}

export function useSWUpdate(): UpdateSWResult {
  const [needRefresh, setNeedRefresh] = useState(false)
  const [offlineReady, setOfflineReady] = useState(false)

  useEffect(() => {
    let refreshing = false
    let updateInterval: number | undefined

    // Check if there's a waiting service worker
    const checkForUpdates = (registration: ServiceWorkerRegistration) => {
      // Check if there's already a waiting service worker
      if (registration.waiting) {
        setNeedRefresh(true)
        return
      }

      // Listen for new service worker installation
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            // Only show notification when new worker is installed and waiting
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller && registration.waiting) {
              setNeedRefresh(true)
            }
          })
        }
      })
    }

    // Listen for offline ready
    const offlineReadyHandler = () => {
      setOfflineReady(true)
      console.log('App ready to work offline')
    }

    // Listen for custom update available event
    const updateAvailableHandler = () => {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          setNeedRefresh(true)
        }
      })
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return
        refreshing = true
        window.location.reload()
      })

      // Check for updates
      navigator.serviceWorker.ready.then((registration) => {
        checkForUpdates(registration)
        // Periodically check for updates (every hour)
        updateInterval = window.setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000)
      })

      // Listen for custom events from service worker
      window.addEventListener('sw:offlineReady', offlineReadyHandler)
      window.addEventListener('sw:updateAvailable', updateAvailableHandler)
    }

    return () => {
      window.removeEventListener('sw:offlineReady', offlineReadyHandler)
      window.removeEventListener('sw:updateAvailable', updateAvailableHandler)
      if (updateInterval !== undefined) {
        clearInterval(updateInterval)
      }
    }
  }, [])

  const updateServiceWorker = async (reloadPage = false) => {
    if (!('serviceWorker' in navigator)) return

    const registration = await navigator.serviceWorker.getRegistration()
    if (!registration || !registration.waiting) return

    // Tell the waiting service worker to skip waiting and become active
    registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    
    setNeedRefresh(false)

    if (reloadPage) {
      window.location.reload()
    }
  }

  return {
    needRefresh,
    offlineReady,
    updateServiceWorker,
  }
}