import { usePWAInstall } from '../hooks/usePWAInstall'
import { useState, useEffect } from 'react'

function PWAInstallButton() {
  const { isInstalled, promptInstall, isIOS, showInstallPrompt } = usePWAInstall()
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (showInstallPrompt && !isInstalled) {
      const dismissed = localStorage.getItem('pwa-install-dismissed')
      if (!dismissed) {
        setShowButton(true)
      }
    } else {
      setShowButton(false)
    }
  }, [showInstallPrompt, isInstalled])

  const handleInstall = async () => {
    const installed = await promptInstall()
    if (installed) {
      setShowButton(false)
    }
  }

  const handleDismiss = () => {
    setShowButton(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
    setTimeout(() => localStorage.removeItem('pwa-install-dismissed'), 7 * 24 * 60 * 60 * 1000)
  }

  if (!showButton) return null

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-[9998] px-4">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {isIOS ? 'افزودن به صفحه اصلی' : 'نصب اپلیکیشن'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {isIOS
                ? 'از دکمه اشتراک‌گذاری، گزینه «افزودن به صفحه اصلی» را انتخاب کنید'
                : 'Digi Parent را روی دستگاه خود نصب کنید'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isIOS ? (
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handleDismiss(); }}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              متوجه شدم
            </a>
          ) : (
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
            >
              نصب
            </button>
          )}
          <button onClick={handleDismiss} className="p-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="بستن">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallButton
