import { motion } from 'framer-motion'
import { AcademicCapIcon } from '@heroicons/react/24/outline'

function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 px-4 max-w-md mx-auto"
        >
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 border border-black">
            <AcademicCapIcon className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">آکادمی</h1>
          <p className="text-gray-600 text-base leading-relaxed">
            محتوای آموزشی و دوره‌های یادگیری برای شما و فرزندانتان به زودی در دسترس خواهد بود
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default CategoriesPage

