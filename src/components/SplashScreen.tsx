import { useState, useEffect } from 'react'

const SPLASH_DURATION_MS = 3000
const FADE_OUT_MS = 400

export function SplashScreen() {
  const [visible, setVisible] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Remove HTML initial splash (from index.html) once React SplashScreen has mounted
    const initialSplash = document.getElementById('app-initial-splash')
    if (initialSplash) initialSplash.remove()

    const hideAt = SPLASH_DURATION_MS - FADE_OUT_MS
    const fadeTimer = setTimeout(() => setFadeOut(true), hideAt)
    const hideTimer = setTimeout(() => setVisible(false), SPLASH_DURATION_MS)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#359c67',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'auto',
      }}
    >
      <img
        src="/icon/parent-logo.svg"
        alt="Digi Parent"
        className="w-[40%] max-w-[200px] object-contain"
      />
    </div>
  )
}
