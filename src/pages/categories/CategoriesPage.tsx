import {
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { LuFileWarning } from "react-icons/lu";
import {
  MdFamilyRestroom,
  MdOutlineSupportAgent,
} from "react-icons/md";

function CategoriesPage() {
  return (
    <div className="bg-white min-h-screen  py-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-3 px-4"
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">
            به آکادمی دیجی پلی خوش آمدید
          </h1>
        </div>
        <p className="text-gray-600 text-sm">
          محتوای آموزشی و دوره‌های یادگیری برای شما و فرزندانتان
        </p>
      </motion.div>

      <div className="grid grid-cols-4 px-4 gap-3">
        <div className=" h-12 border border-indigo-700 mb-3 gap-2 flex items-center justify-center rounded-lg ">
          <HeartIcon className="w-6 h-6 text-indigo-700" />
          <p className="text-xs font-semibold mt-1 text-indigo-700">همه</p>
        </div>
        <div className=" h-12 border border-black mb-3 flex gap-2 items-center justify-center rounded-lg ">
          <MdOutlineSupportAgent className="w-6 h-6 text-black" />
          <p className="text-xs font-semibold mt-1 text-gray-900">مشاوره</p>
        </div>
        <div className=" h-12 border border-black mb-3 flex gap-2 items-center justify-center rounded-lg ">
          <LuFileWarning className="w-6 h-6 text-black" />
          <p className="text-xs font-semibold mt-1 text-gray-900"> اموزشی</p>
        </div>
        <div className=" h-12 border border-black mb-3 flex gap-2 items-center justify-center rounded-lg ">
          <MdFamilyRestroom className="w-6 h-6 text-black" />
          <p className="text-xs font-semibold mt-1 text-gray-900">فرزندان</p>
        </div>
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-5"
      >
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <UserCircleIcon className="border-2 border-black  w-9 h-9 text-gray-400 rounded-full" />
              <p className=" text-black">مهسا نوروزی لواسانی</p>
              <p className="text-xs text-white px-2 bg-indigo-700 py-1 rounded-full">آموزشی</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">3 ساعت پیش</p>
            </div>
          </div>
          <div className="h-96 w-full">
            <img
              src="/image/69c68ee04e3f0f73009ee241d8716406.jpg"
              alt="image"
              className="max-h-96 w-full object-cover object-top"
            />
          </div>

          <div className="px-4">
            <div className="flex items-center justify-between">
              <div>
                <p>سلام امیدوارم خوب باشید </p>
              </div>
              <div className="flex gap-1">
                <ChatBubbleBottomCenterTextIcon className="w-7 h-7 text-black" />
                <HeartIcon className="w-7 h-7 text-black" />
              </div>
            </div>
            <div className="flex items-center justify-between w-full mt-1">
              <p className="text-xs">
                سلام امیدوارم خوب باشید یه دیجی پلی خوش آمدید ...{" "}
              </p>
              <p className="text-xs text-indigo-700 font-semibold">
                {" "}
                نمایش بیشتر{" "}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-5"
      >
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <UserCircleIcon className="border-2 border-black  w-9 h-9 text-gray-400 rounded-full" />
              <p className=" text-black">محمد مهرابی  </p>
              <p className="text-xs text-white px-2 bg-indigo-700 py-1 rounded-full">سرگرمی</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">3 ساعت پیش</p>
            </div>
          </div>

          <div className="px-4">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <div>
                  <img
                    src="/image/c06d5fded08996e6a05fb2a8ac75d98e.gif"
                    alt="img"
                    className="w-20 h-20 rounded-lg"
                  />
                </div>
                <div>
                  <p>سلام امیدوارم خوب باشید </p>
                </div>
              </div>
              <div className="flex gap-1">
                <ChatBubbleBottomCenterTextIcon className="w-7 h-7 text-black" />
                <HeartIcon className="w-7 h-7 text-black" />
              </div>
            </div>
            <div className="flex items-center justify-between w-full mt-2">
              <p className="text-xs">
                سلام امیدوارم خوب باشید یه دیجی پلی خوش آمدید ...
              </p>
              <p className="text-xs text-indigo-700 font-semibold">
                نمایش بیشتر
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-5"
      >
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <UserCircleIcon className="border-2 border-black  w-9 h-9 text-gray-400 rounded-full" />
              <p className=" text-black">  فاطمه مهرابی</p>
              <p className="text-xs text-white px-2 bg-indigo-700 py-1 rounded-full">مشاوره</p>
              <p className="text-xs text-white px-2 bg-indigo-700 py-1 rounded-full">فرزندان</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">3 ساعت پیش</p>
            </div>
          </div>
          <div className="h-96 w-full">
            <img
              src="/image/82097d680b2343a5d1b22d34e74e4a6a.jpg"
              alt="image"
              className="max-h-96 w-full object-cover object-top"
            />
          </div>

          <div className="px-4">
            <div className="flex items-center justify-between">
              <div>
                <p>سلام امیدوارم خوب باشید </p>
              </div>
              <div className="flex gap-1">
                <ChatBubbleBottomCenterTextIcon className="w-7 h-7 text-black" />
                <HeartIcon className="w-7 h-7 text-black" />
              </div>
            </div>
            <div className="flex items-center justify-between w-full mt-1">
              <p className="text-xs">
                سلام امیدوارم خوب باشید یه دیجی پلی خوش آمدید ...{" "}
              </p>
              <p className="text-xs text-indigo-700 font-semibold">
                {" "}
                نمایش بیشتر{" "}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      
    </div>
  );
}

export default CategoriesPage;
