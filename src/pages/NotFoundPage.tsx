import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 px-6" dir="rtl">
      <div className="max-w-md w-full text-center space-y-6">
        <div>
          <p className="text-sm text-gray-400 mb-2">خطای ۴۰۴</p>
          <h1 className="text-3xl font-extrabold mb-3">صفحه‌ای که دنبالش بودید پیدا نشد</h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            احتمالاً آدرس را اشتباه وارد کرده‌اید یا این صفحه دیگر وجود ندارد.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
          >
            بازگشت به صفحه اصلی
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full border border-gray-300 text-gray-800 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            بازگشت به صفحه قبل
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
