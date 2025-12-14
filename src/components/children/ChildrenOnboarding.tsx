import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  title: string;
  description: string;
  image: string;
  bgColor: string;
  textColor: string;
}

interface ChildrenOnboardingProps {
  slides: Slide[];
  onComplete: () => void;
}

function ChildrenOnboarding({ slides, onComplete }: ChildrenOnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
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
      className="fixed inset-0 z-50 flex flex-col justify-end overflow-hidden transition-all duration-500"
      style={{
        backgroundImage: `url(${slides[currentSlide].image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Bottom white card */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative z-10 w-full bg-white rounded-t-4xl px-6 py-8 shadow-2xl"
      >
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
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-3xl font-bold mb-4 text-gray-900 text-center"
            >
              {slides[currentSlide].title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-gray-600 text-center mb-6 leading-relaxed"
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicator */}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onClick={handleNext}
          className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 rounded-xl text-lg transition-colors"
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
        >
          {currentSlide === slides.length - 1 ? 'شروع کنید' : 'بعدی'}
        </motion.button>
      </motion.div>
    </div>
  );
}

export default ChildrenOnboarding;

