import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router/routes'
import { AuthProvider } from './context/AuthContext'
import { SplashScreen } from './components/SplashScreen'

// Service Worker and PWA disabled temporarily due to server MIME type issues
// vite-plugin-pwa handles service worker registration automatically
// No need for manual registration here

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <SplashScreen />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  </StrictMode>,
)
