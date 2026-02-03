import { useState } from "react";
import {
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { toPersianNumber } from "../../utils/numberUtils";

const NASLE_Z_SLIDES = [
  { id: 1, src: "/image/Nasle-Z_01.png", alt: "راهنمای نسل Z - اسلاید ۱" },
  { id: 2, src: "/image/Nasle-Z_02.png", alt: "راهنمای نسل Z - اسلاید ۲" },
  { id: 3, src: "/image/Nasle-Z_03.png", alt: "راهنمای نسل Z - اسلاید ۳" },
  { id: 4, src: "/image/Nasle-Z_04.png", alt: "راهنمای نسل Z - اسلاید ۴" },
  { id: 5, src: "/image/Nasle-Z_05.png", alt: "راهنمای نسل Z - اسلاید ۵" },
  { id: 6, src: "/image/Nasle-Z_06.png", alt: "راهنمای نسل Z - اسلاید ۶" },
  { id: 7, src: "/image/Nasle-Z_07.png", alt: "راهنمای نسل Z - اسلاید ۷" },
  { id: 8, src: "/image/Nasle-Z_08.png", alt: "راهنمای نسل Z - اسلاید ۸" },
  { id: 9, src: "/image/Nasle-Z_09.png", alt: "راهنمای نسل Z - اسلاید ۹" },
  { id: 10, src: "/image/Nasle-Z_10.png", alt: "راهنمای نسل Z - اسلاید ۱۰" },
];

const CATEGORIES = [
  { id: "all", label: "همه" },
  { id: "digital", label: "مدیریت دنیای دیجیتال" },
  { id: "social", label: "دوستی، ارتباط و مهارت‌های اجتماعی" },
  { id: "privacy", label: "امنیت خانه و حریم شخصی" },
  { id: "family", label: "تعامل و گفت‌وگوی خانوادگی" },
  { id: "teen", label: "فرزندپروری در سن نوجوانی" },
  { id: "travel", label: "سفر، تجربه و استقلال تدریجی" },
  { id: "lifestyle", label: "خواب، انرژی و سبک زندگی سالم" },
  { id: "learning", label: "یادگیری، تمرکز و انگیزه" },
  { id: "behavior", label: "رفتار، مسئولیت‌پذیری و خودکنترلی" },
  { id: "mental", label: "سلامت روان و تاب‌آوری" },
];

const SWIPE_THRESHOLD = 50;

function CategoriesPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [slideIndex, setSlideIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchOffset, setTouchOffset] = useState(0);

  const goPrev = () => setSlideIndex((i) => Math.max(0, i - 1));
  const goNext = () => setSlideIndex((i) => Math.min(NASLE_Z_SLIDES.length - 1, i + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setTouchOffset(currentX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    if (touchOffset > SWIPE_THRESHOLD) goNext();
    else if (touchOffset < -SWIPE_THRESHOLD) goPrev();
    setTouchStartX(null);
    setTouchOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStartX(e.clientX);
    setTouchOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStartX === null || !e.buttons) return;
    setTouchOffset(e.clientX - touchStartX);
  };

  const handleMouseUp = () => {
    if (touchStartX === null) return;
    if (touchOffset > SWIPE_THRESHOLD) goNext();
    else if (touchOffset < -SWIPE_THRESHOLD) goPrev();
    setTouchStartX(null);
    setTouchOffset(0);
  };

  const handleMouseLeave = () => {
    setTouchStartX(null);
    setTouchOffset(0);
  };

  return (
    <div className="bg-white min-h-screen py-6 max-w-4xl mx-auto" dir="rtl">

      <div className="bg-white sticky top-0 py-2 z-10">
        <div className="px-4 mb-3 overflow-x-auto overflow-y-hidden flex gap-2 flex-nowrap scroll-smooth" style={{ WebkitOverflowScrolling: "touch" }}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 py-2.5 px-4 rounded-lg border text-xs font-semibold transition-all ${isActive
                    ? "border-[#359C67] bg-[#359C67]/10 text-[#359C67]"
                    : "border-gray-300 bg-white text-gray-900 hover:border-gray-400"
                  }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-3 px-4"
        >
          <div className="relative">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
            <input
              type="text"
              placeholder="جستجوی محتوا آکادمی..."
              className="w-full pr-10 pl-4 py-3 placeholder-black bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
          </div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 pb-8 "
      >
        <div className="flex flex-col">
          {/* اسلایدر راهنمای نسل Z - سوایپ با دست مثل اینستاگرام */}
          <div
            className="relative w-full overflow-hidden bg-gray-100 touch-pan-y select-none cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ touchAction: "pan-y" }}
          >
            <div
              className="flex ease-out"
              style={{
                width: `${NASLE_Z_SLIDES.length * 100}%`,
                transform: `translateX(calc(${slideIndex * (100 / NASLE_Z_SLIDES.length)}% + ${touchOffset}px))`,
                transition: touchStartX !== null ? "none" : "transform 0.25s ease-out",
              }}
            >
              {NASLE_Z_SLIDES.map((slide) => (
                <div
                  key={slide.id}
                  className="shrink-0 w-full"
                  style={{ width: `${100 / NASLE_Z_SLIDES.length}%` }}
                >
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className="w-full h-auto max-h-112 object-contain object-top bg-transparent"
                  />
                </div>
              ))}
            </div>
            {/* نقطه‌های ناوبری */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {NASLE_Z_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlideIndex(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === slideIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`رفتن به اسلاید ${toPersianNumber(i + 1)}`}
                />
              ))}
            </div>
          </div>

          <div className="">
            <div className="w-full bg-gray-50 p-4 sm:p-5">
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-justify space-y-3">
                <span className="block">تو این روزهای پرالتهاب، سخت‌ترین چیز اون خشم و غمیه که نمی‌دونیم کجا خالیش کنیم؛ واسه همین میاریمش تو خونه، می‌شینه روی رابطه‌هامون و نوجوان‌مون رو هی از ما دورتر می‌کنه.</span>
                <span className="block">اما اگه مدلِ متفاوت نسل زد (Z) رو بشناسیم، می‌تونیم به‌جای اینکه جلوی هم گارد بگیریم، راه رو برای هم باز کنیم.</span>
                <span className="block">یادمون باشه این روزا «رابطه» داشتن، خیلی واجب‌تر از برنده شدن تو بحث‌هاست؛ نذاریم این تفاوت نگاه‌ها، بینمون دیوار بکشه.</span>
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-3">
                  <button type="button" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors" aria-label="نظر">
                    <ChatBubbleBottomCenterTextIcon className="w-5 h-5" />
                    <span className="text-xs font-medium">نظر</span>
                  </button>
                  <button type="button" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors" aria-label="پسندیدن">
                    <HeartIcon className="w-5 h-5" />
                    <span className="text-xs font-medium">پسندیدن</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>


    </div>
  );
}

export default CategoriesPage;
