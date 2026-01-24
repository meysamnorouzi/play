import { useState, useEffect, useRef } from 'react';

interface DatePickerProps {
  value: string; // Format: YYYY/MM/DD
  onChange: (date: string) => void;
  placeholder?: string;
}

const PERSIAN_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
];

// Convert English numbers to Persian
const toPersianNumber = (num: number | string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

// Get number of days in a month (handles leap years)
const getDaysInMonth = (year: number, month: number): number => {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  
  // Esfand (last month): 29 days in normal year, 30 days in leap year
  // Leap year calculation: (year + 2346) % 128 < 29
  const isLeapYear = (year + 2346) % 128 < 29;
  return isLeapYear ? 30 : 29;
};

// Parse Persian date string to numbers
const parseDate = (dateString: string): { year: number; month: number; day: number } => {
  if (!dateString || dateString.trim() === '') {
    return { year: 1380, month: 1, day: 1 };
  }
  
  const parts = dateString.split('/').map(Number);
  return {
    year: parts[0] || 1380,
    month: parts[1] || 1,
    day: parts[2] || 1
  };
};

// Format date to string
const formatDate = (year: number, month: number, day: number): string => {
  return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
};

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder = 'تاریخ تولد را انتخاب کنید' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempDate, setTempDate] = useState(parseDate(value));
  const modalRef = useRef<HTMLDivElement>(null);

  // Generate list of years (1300 to 1410)
  const years = Array.from({ length: 111 }, (_, i) => 1300 + i);
  
  // Generate list of days based on selected month and year
  const days = Array.from(
    { length: getDaysInMonth(tempDate.year, tempDate.month) },
    (_, i) => i + 1
  );

  // Update tempDate when value changes
  useEffect(() => {
    if (value) {
      setTempDate(parseDate(value));
    }
  }, [value]);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Open modal and set tempDate
  const handleInputClick = () => {
    setTempDate(parseDate(value));
    setIsOpen(true);
  };

  const handleYearChange = (year: number) => {
    const newDate = { ...tempDate, year };
    // Check if selected day is valid in new month
    const maxDay = getDaysInMonth(year, newDate.month);
    if (newDate.day > maxDay) {
      newDate.day = maxDay;
    }
    setTempDate(newDate);
  };

  const handleMonthChange = (month: number) => {
    const newDate = { ...tempDate, month };
    // Check if selected day is valid in new month if not set to the last day of the month
    const maxDay = getDaysInMonth(newDate.year, month);
    if (newDate.day > maxDay) {
      newDate.day = maxDay;
    }
    setTempDate(newDate);
  };

  const handleDayChange = (day: number) => {
    setTempDate({ ...tempDate, day });
  };

  // Confirm and close modal
  const handleConfirm = () => {
    onChange(formatDate(tempDate.year, tempDate.month, tempDate.day));
    setIsOpen(false);
  };

  // Cancel and close modal
  const handleCancel = () => {
    setTempDate(parseDate(value));
    setIsOpen(false);
  };

  // Convert date to Persian for display
  const getDisplayDate = (dateStr: string): string => {
    if (!dateStr) return '';
    return dateStr.split('/').map(part => toPersianNumber(part)).join('/');
  };

  const displayValue = value ? getDisplayDate(value) : '';

  return (
    <>
      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          readOnly
          value={displayValue}
          onClick={handleInputClick}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-300 outline-none transition-all text-right bg-white hover:border-gray-300 cursor-pointer"
          dir="rtl"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Modal Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center transition-opacity duration-300"
          onClick={handleCancel}
        >
          {/* Modal Content - constrained to mobile width */}
          <div
            ref={modalRef}
            className="w-full max-w-[430px] bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            <div className="p-6 space-y-6">
              {/* Handle Bar */}
              <div className="flex justify-center mb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
              </div>

              {/* Header */}
              <div className="flex items-center justify-center gap-2 pb-4 border-b border-gray-200">
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">انتخاب تاریخ تولد</h3>
              </div>

              {/* Selectors */}
              <div className="grid grid-cols-3 gap-4">
                {/* Year selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 text-center">سال</label>
                  <div className="relative">
                    <select
                      value={tempDate.year}
                      onChange={(e) => handleYearChange(Number(e.target.value))}
                      className="w-full px-3 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-300 outline-none transition-all bg-white text-center text-base font-medium text-gray-800 appearance-none cursor-pointer hover:border-gray-300"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {toPersianNumber(year)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Month selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 text-center">ماه</label>
                  <div className="relative">
                    <select
                      value={tempDate.month}
                      onChange={(e) => handleMonthChange(Number(e.target.value))}
                      className="w-full px-3 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-300 outline-none transition-all bg-white text-center text-base font-medium text-gray-800 appearance-none cursor-pointer hover:border-gray-300"
                    >
                      {PERSIAN_MONTHS.map((month, index) => (
                        <option key={index + 1} value={index + 1}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Day selector */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 text-center">روز</label>
                  <div className="relative">
                    <select
                      value={tempDate.day}
                      onChange={(e) => handleDayChange(Number(e.target.value))}
                      className="w-full px-3 py-3 rounded-lg border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-300 outline-none transition-all bg-white text-center text-base font-medium text-gray-800 appearance-none cursor-pointer hover:border-gray-300"
                    >
                      {days.map((day) => (
                        <option key={day} value={day}>
                          {toPersianNumber(day)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Display selected date */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="text-sm text-gray-600">تاریخ انتخاب شده:</span>
                  <span className="text-lg font-semibold text-black" dir="ltr">
                    {getDisplayDate(formatDate(tempDate.year, tempDate.month, tempDate.day))}
                  </span>
                </div>
              </div>

              {/* Confirm button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="w-full px-4 py-3 rounded-xl bg-indigo-700 hover:bg-gray-800 text-white font-semibold shadow-lg shadow-gray-300 transition-all active:scale-[0.98]"
                >
                  تایید
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default DatePicker;

