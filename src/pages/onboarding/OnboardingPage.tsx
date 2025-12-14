import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

const slides: Slide[] = [
  {
    title: 'به دیجی پلی خوش آمدید',
    description: 'با استفاده از این اپلیکیشن می‌توانید به راحتی به تمام امکانات دسترسی داشته باشید',
    bgColor: '#e98c20',
    textColor: '#ffffff',
    icon: (
      <img 
        src="/image/4d66b4808ba10406f9def8a711dcff23.gif" 
        alt="خوش آمدید" 
        className="w-80 h-80 object-contain"
      />
    ),
  },
  {
    title: 'امکانات متنوع',
    description: 'دسترسی به طیف وسیعی از ویژگی‌ها و قابلیت‌های کاربردی برای تجربه بهتر',
    bgColor: '#dde5f0',
    textColor: '#000000',
    icon: (
      <img 
        src="/image/f5a1590fe096b8eb539ee7bae19cacef.gif" 
        alt="امکانات" 
        className="w-80 h-80 object-contain"
      />
    ),
  },
  {
    title: 'شروع کنید',
    description: 'همین حالا شروع کنید و از تمام امکانات اپلیکیشن بهره‌مند شوید',
    bgColor: '#ff9394',
    textColor: '#ffffff',
    icon: (
      <img 
        src="/image/3660de009181114f91daca623790f462.gif" 
        alt="شروع" 
        className="w-96 h-96 object-contain"
      />
    ),
  },
];

const OnboardingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    } else {
      // Save that user has completed onboarding
      localStorage.setItem('onboardingCompleted', 'true');
      // Navigate to home if authenticated, otherwise to login
      navigate(isAuthenticated ? '/' : '/login');
    }
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Slide animation settings (reversed direction for RTL)
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
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between px-4 font-sans pb-8 transition-colors duration-500 overflow-hidden" 
      style={{ backgroundColor: slides[currentSlide].bgColor }}
      dir="rtl"
    >
      <div className="w-full max-w-md flex flex-col items-center justify-center flex-1">
        {/* Slide Content with animation */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="flex flex-col items-center justify-center"
          >
            <motion.h1 
              className="text-3xl font-bold mb-4 text-center"
              style={{ color: slides[currentSlide].textColor }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {slides[currentSlide].title}
            </motion.h1>
            
            <motion.div 
              className="mb-4 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {slides[currentSlide].icon}
            </motion.div>
            
            <motion.p 
              className="text-center text-lg leading-relaxed max-w-sm"
              style={{ color: slides[currentSlide].textColor }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next/Finish Button with animation - Fixed to bottom */}
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {/* Dots Indicator with animation */}
        <div className="flex justify-center gap-2 mb-4">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-black'
                  : 'w-2 bg-gray-300'
              }`}
              aria-label={`اسلاید ${index + 1}`}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <motion.button
          onClick={handleNext}
          className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 rounded-xl text-lg"
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
        >
          {currentSlide === slides.length - 1 ? 'شروع کنید' : 'بعدی'}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;

