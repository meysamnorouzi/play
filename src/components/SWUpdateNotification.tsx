import { useSWUpdate } from '../hooks/useSWUpdate'
import { useState, useEffect } from 'react'

function SWUpdateNotification() {
  const { needRefresh, offlineReady, updateServiceWorker } = useSWUpdate()
  const [showOfflineReady, setShowOfflineReady] = useState(false)

  useEffect(() => {
    if (offlineReady) {
      setShowOfflineReady(true)
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowOfflineReady(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [offlineReady])

  const handleUpdate = () => {
    updateServiceWorker(true)
  }

  const handleDismiss = () => {
    setShowOfflineReady(false)
  }

  if (needRefresh) {
    return (
      <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
        <div className="bg-blue-600 text-white rounded-lg shadow-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">محتوای جدید موجود است</p>
              <p className="text-xs text-blue-100 mt-0.5">
                برای مشاهده آخرین تغییرات، صفحه را به‌روزرسانی کنید
              </p>
            </div>
          </div>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            به‌روزرسانی
          </button>
        </div>
      </div>
    )
  }

  if (showOfflineReady) {
    return (
      <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
        <div className="bg-green-600 text-white rounded-lg shadow-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">اپلیکیشن آماده کار آفلاین است</p>
              <p className="text-xs text-green-100 mt-0.5">
                این اپلیکیشن اکنون بدون اتصال به اینترنت کار می‌کند
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-2 text-green-100 hover:text-white transition-colors"
            aria-label="بستن"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default SWUpdateNotification