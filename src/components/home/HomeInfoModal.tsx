import { useState } from 'react'
import Modal from '../Modal'
import { motion, AnimatePresence } from 'framer-motion'

interface HomeInfoModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Slide {
  image: string
  bgColor: string
  textColor: string
  buttonBg: string
  buttonTextColor: string
  buttonHover: string
}

export const slides: Slide[] = [
  {
    image: '/image/6abd55cfb396dd034d671b8b248f7068.gif',
    bgColor: 'bg-[#f6e4bc]',
    textColor: 'text-[#232b31]',
    buttonBg: 'bg-[#232b31]',
    buttonTextColor: 'text-white',
    buttonHover: 'hover:bg-purple-700',
  },
  {
    image: '/image/779ca6a7b82585736360df3b35c20e18.gif',
    bgColor: 'bg-[#fb9545]',
    textColor: 'text-[#ffffff]',
    buttonBg: 'bg-[#ffffff]',
    buttonTextColor: 'text-[#fb9545]',
    buttonHover: 'hover:bg-blue-700',
  },
  {
    image: '/image/2085bcffb85028955dd14e4a7af61c83.gif',
    bgColor: 'bg-[#7f7d7f]',
    textColor: 'text-[#ffffff]',
    buttonBg: 'bg-[#ffffff]',
    buttonTextColor: 'text-[#7f7d7f]',
    buttonHover: 'hover:bg-pink-700',
  },
  {
    image: '/image/8375ca061f4bc670f8289cc2d2d7f51a.gif',
    bgColor: 'bg-[#837391]',
    textColor: 'text-[#ffffff]',
    buttonBg: 'bg-[#ffffff]',
    buttonTextColor: 'text-[#837391]',
    buttonHover: 'hover:bg-green-700',
  },
  {
    image: '/image/a0d5b4290646e2cb919f9a7213ddf894.gif',
    bgColor: 'bg-[#f7f4ea]',
    textColor: 'text-[#000000]',
    buttonBg: 'bg-[#000000]',
    buttonTextColor: 'text-white',
    buttonHover: 'hover:bg-orange-700',
  },
  {
    image: '/image/c06d5fded08996e6a05fb2a8ac75d98e.gif',
    bgColor: 'bg-[#3025c2]',
    textColor: 'text-[#ffffff]',
    buttonBg: 'bg-[#ffffff]',
    buttonTextColor: 'text-[#3025c2]',
    buttonHover: 'hover:bg-cyan-700',
  },
  {
    image: '/image/cdb14b1f2ec4963f3b9801487757363a.gif',
    bgColor: 'bg-[#eb3e46]',   
    textColor: 'text-[#ffffff]',
    buttonBg: 'bg-[#ffffff]',
    buttonTextColor: 'text-[#eb3e46]',
    buttonHover: 'hover:bg-rose-700',
  },
]

function HomeInfoModal({ isOpen, onClose }: HomeInfoModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const nextSlide = () => {
    setDirection(1)
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }

  // Handle swipe gesture
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - previous slide
      prevSlide()
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right - next slide
      nextSlide()
    }
  }

  const currentSlideData = slides[currentSlide]

  const handleConfirm = () => {
    localStorage.setItem('selectedSlide', currentSlide.toString())
    window.dispatchEvent(new CustomEvent('slideChanged', { detail: currentSlide }))
    onClose()
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backgroundColor={currentSlideData.bgColor}
    >
      <div className="text-center">
        <div className="relative mb-6">
          <div 
            className="flex justify-center overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img 
                key={currentSlide}
                src={currentSlideData.image}
                alt={`تصویر ${currentSlide + 1}`}
                className="w-56 h-56 object-contain"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              />
            </AnimatePresence>
          </div>

          <motion.button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            aria-label="اسلاید قبلی"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
            aria-label="اسلاید بعدی"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`برو به اسلاید ${index + 1}`}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.p 
            key={currentSlide}
            className={`text-base leading-relaxed mb-6 ${currentSlideData.textColor}`}
            custom={direction}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            اینجا می‌تونی محتوای دلخواهت رو قرار بدی. 
            این مودال با انیمیشن زیبا از پایین صفحه باز میشه!
            با کشیدن عکس‌ها می‌تونی بین اسلایدها جابجا بشی.
          </motion.p>
        </AnimatePresence>

        <div className="space-y-3">
          <motion.button 
            onClick={handleConfirm}
            className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${currentSlideData.buttonBg} ${currentSlideData.buttonTextColor} ${currentSlideData.buttonHover}`}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
          >
            تایید
          </motion.button>
        </div>
      </div>
    </Modal>
  )
}

export default HomeInfoModal

