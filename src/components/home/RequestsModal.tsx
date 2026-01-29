import { AiOutlineClose, AiOutlineInbox } from 'react-icons/ai'
import { toPersianNumber } from '../../utils/numberUtils'

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  password: string;
  birthDate: string;
  avatar: string;
  isOnline?: boolean;
  onlineSince?: number;
  lastOnlineTime?: number;
}

interface Request {
  id: string;
  title: string;
  description: string;
  type: string;
  date: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface RequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child | null;
  requests: Request[];
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
  const day = date.getDate()
  const month = persianMonths[date.getMonth()]
  return `${day} ${month}`
}

function RequestsModal({ isOpen, onClose, child, requests, onApprove, onReject }: RequestsModalProps) {
  if (!child || !isOpen) return null

  const handleApprove = (requestId: string) => {
    if (onApprove) {
      onApprove(requestId)
    }
  }

  const handleReject = (requestId: string) => {
    if (onReject) {
      onReject(requestId)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap">
            تایید شده
          </span>
        )
      case 'rejected':
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap">
            رد شده
          </span>
        )
      default:
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap">
            در انتظار بررسی
          </span>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70"
      />
      
      {/* Bottom Sheet - constrained to mobile width */}
      <div
        className="fixed bottom-0 w-full max-w-[430px] bg-white rounded-t-2xl max-h-[90vh] flex flex-col shadow-2xl z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-16 h-1.5 bg-black/20 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                درخواست‌های {child.firstName} {child.lastName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{toPersianNumber(requests.length)} درخواست</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <AiOutlineClose className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 sm:py-5 bg-gray-50">
          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Header Section */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-1.5">
                        {request.title}
                      </h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                          {request.type}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatDate(request.date)}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                    {request.description}
                  </p>

                  {/* Action Buttons - Only show for pending requests */}
                  {request.status === 'pending' && (
                    <div className="flex gap-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold text-sm sm:text-base hover:bg-red-100 transition-colors duration-200"
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
                        رد درخواست
                      </button>
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#359C67] text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-[#2d7d52] transition-colors duration-200 shadow-sm"
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
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        تایید درخواست
                      </button>
                    </div>
                  )}

                  {/* Status Message for approved/rejected */}
                  {request.status !== 'pending' && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 text-center">
                        این درخواست {request.status === 'approved' ? 'تایید' : 'رد'} شده است
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full mx-auto mb-4 sm:mb-5 flex items-center justify-center">
                <AiOutlineInbox className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
              </div>
              <p className="text-gray-600 text-base sm:text-lg font-medium">
                هیچ درخواستی در انتظار نیست
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequestsModal

