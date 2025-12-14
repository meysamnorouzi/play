import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import ChildrenOnboarding from '../../components/children/ChildrenOnboarding';
import AddChildModal from '../../components/children/AddChildModal';
import { QRCodeSVG } from 'qrcode.react';
import Modal from '../../components/Modal';

interface Slide {
  title: string;
  description: string;
  image: string;
  bgColor: string;
  textColor: string;
}

const slides: Slide[] = [
  {
    title: 'مدیریت فرزندان',
    description: 'در این صفحه می‌توانید اطلاعات فرزندان خود را مدیریت کنید و آن‌ها را اضافه یا ویرایش کنید',
    image: '/image/c30443dd88560f56a71aef4bc60965b7.jpg',
    bgColor: '#dde5f0',
    textColor: '#000000',
  },
  {
    title: 'دسترسی کامل',
    description: 'به تمام فعالیت‌ها و تراکنش‌های مربوط به هر فرزند دسترسی داشته باشید و آن‌ها را پیگیری کنید',
    image: '/image/68c1c772093c3c54af39e41cfbec79de.jpg',
    bgColor: '#e98c20',
    textColor: '#ffffff',
  },
];

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  password: string;
  birthDate: string;
  avatar: string;
  isOnline?: boolean;
  onlineSince?: number; // timestamp when went online
  lastOnlineTime?: number; // timestamp of last online time
}

function ChildrenPage() {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if user has seen this page before
    const hasSeenChildrenPage = localStorage.getItem('childrenPageOnboardingSeen');
    if (!hasSeenChildrenPage) {
      setShowOnboarding(true);
    }

    // Load children list from localStorage
    const storedChildren = localStorage.getItem('childrenList');
    if (storedChildren) {
      const parsedChildren = JSON.parse(storedChildren);
      // Add test times for children who don't have times
      const now = Date.now();
      const childrenWithTime = parsedChildren.map((child: Child, index: number) => {
        // If times don't exist, add test times
        if (!child.onlineSince && !child.lastOnlineTime) {
          // Alternating online and offline
          const isOnline = index % 2 === 0;
          return {
            ...child,
            isOnline,
            onlineSince: isOnline ? now - (index + 1) * 5 * 60000 : undefined, // 5 minutes multiplied by index
            lastOnlineTime: isOnline ? undefined : now - (index + 1) * 2 * 3600000, // 2 hours multiplied by index
          };
        }
        return child;
      });
      setChildren(childrenWithTime);
      // Save again with test times
      localStorage.setItem('childrenList', JSON.stringify(childrenWithTime));
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('childrenPageOnboardingSeen', 'true');
    setShowOnboarding(false);
  };

  const handleAddChild = () => {
    setShowAddModal(true);
  };

  const handleAddChildSubmit = (childData: {
    firstName: string;
    lastName: string;
    nationalId: string;
    password: string;
    birthDate: string;
    avatar: string;
  }) => {
    const now = Date.now();
    const isOnline = Math.random() > 0.5;
    
    const newChild: Child = {
      id: Date.now().toString(),
      ...childData,
      isOnline,
      onlineSince: isOnline ? now : undefined,
      lastOnlineTime: isOnline ? undefined : now - Math.random() * 24 * 60 * 60 * 1000, // 0 to 24 hours ago
    };
    
    const updatedChildren = [...children, newChild];
    setChildren(updatedChildren);
    localStorage.setItem('childrenList', JSON.stringify(updatedChildren));
  };

  // Function to calculate online/offline time
  const getTimeStatus = (child: Child): string => {
    if (child.isOnline && child.onlineSince) {
      const minutes = Math.floor((currentTime - child.onlineSince) / 60000);
      if (minutes < 1) {
        return 'همین الان آنلاین شد';
      }
      return `${minutes} دقیقه آنلاین است`;
    } else if (child.lastOnlineTime) {
      const hours = Math.floor((currentTime - child.lastOnlineTime) / 3600000);
      if (hours < 1) {
        const minutes = Math.floor((currentTime - child.lastOnlineTime) / 60000);
        return `${minutes} دقیقه پیش آنلاین بود`;
      }
      return `${hours} ساعت پیش آنلاین بود`;
    }
    return 'اطلاعاتی موجود نیست';
  };

  return (
    <div className="min-h-screen" dir="rtl">
      <AnimatePresence>
        {showOnboarding ? (
          <ChildrenOnboarding slides={slides} onComplete={handleOnboardingComplete} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col"
          >
            {children.length === 0 ? (
              // Empty state - show add child button
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-gray-50">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-3 text-gray-900">فرزندان</h1>
                  <p className="text-gray-500 text-sm">هنوز هیچ فرزندی اضافه نکرده‌اید</p>
                </div>
                <motion.button
                  onClick={handleAddChild}
                  className="w-full max-w-sm bg-black hover:bg-gray-800 text-white font-semibold py-3.5 rounded-xl text-base transition-colors shadow-sm"
                  whileTap={{ scale: 0.98 }}
                >
                  افزودن فرزند
                </motion.button>
              </div>
            ) : (
              // Children list
              <div className="flex-1 bg-gray-50 px-4 py-6 pb-24 max-w-4xl mx-auto w-full">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">فرزندان</h1>
                  <motion.button
                    onClick={handleAddChild}
                    className="bg-black hover:bg-gray-800 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors shadow-sm"
                    whileTap={{ scale: 0.98 }}
                  >
                    افزودن فرزند
                  </motion.button>
                </div>
                
                {/* Children cards list */}
                <div className="space-y-3">
                  <AnimatePresence>
                    {children.map((child, index) => (
                      <motion.div
                        key={child.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden"
                        onClick={() => navigate(`/children/${child.id}`)}
                      >
                        <div className="flex items-center gap-4 p-4">
                          {/* Avatar */}
                          <div className="relative shrink-0">
                            <img
                              src={child.avatar}
                              alt={`${child.firstName} ${child.lastName}`}
                              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                            />
                            {child.isOnline && (
                              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>

                          {/* Information */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h3 className="text-base font-bold text-gray-900 truncate">
                                {child.firstName} {child.lastName}
                              </h3>
                              <div className="flex items-center gap-2 shrink-0">
                                <div className={`w-2 h-2 rounded-full ${
                                  child.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                                <span className={`text-xs font-medium ${
                                  child.isOnline ? 'text-green-600' : 'text-gray-500'
                                }`}>
                                  {child.isOnline ? 'آنلاین' : 'آفلاین'}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">
                              {getTimeStatus(child)}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-600">
                              <span>کد ملی: {child.nationalId}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 shrink-0">
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/children/${child.id}`)
                              }}
                              className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                              whileTap={{ scale: 0.95 }}
                            >
                              جزئیات
                            </motion.button>
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedChild(child)
                                setShowQRModal(true)
                              }}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap"
                              whileTap={{ scale: 0.95 }}
                            >
                              QR
                            </motion.button>
                          </div>
                        </div>
                        
                        {/* Define Task Button */}
                        <div className="border-t border-gray-100 px-4 py-3">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation()
                              navigate(`/children/${child.id}/define-task`)
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors border border-black"
                            whileTap={{ scale: 0.98 }}
                          >
                            <PlusIcon className="w-4 h-4" />
                            <span>تعریف تسک</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add child modal */}
      <AddChildModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddChildSubmit}
      />

      {/* QR Code Modal */}
      <Modal
        isOpen={showQRModal}
        onClose={() => {
          setShowQRModal(false)
          setSelectedChild(null)
        }}
        title="کیوارکد ورود"
        maxHeight="70vh"
      >
        {selectedChild && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-4">
              <QRCodeSVG
                value={JSON.stringify({
                  childId: selectedChild.id,
                  nationalId: selectedChild.nationalId,
                  password: selectedChild.password,
                  type: 'login'
                })}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-sm text-gray-600 text-center max-w-xs">
              این کیوارکد را برای ورود فرزند خود اسکن کنید
            </p>
      
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ChildrenPage;

