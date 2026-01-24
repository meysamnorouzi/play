import { AiOutlineClose, AiOutlineInbox } from 'react-icons/ai'

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
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
  const day = date.getDate()
  const month = persianMonths[date.getMonth()]
  return `${day} ${month}`
}

function RequestsModal({ isOpen, onClose, child, requests }: RequestsModalProps) {
  if (!child || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70"
      />
      
      {/* Bottom Sheet - constrained to mobile width */}
      <div
        className="fixed bottom-0 w-full max-w-[430px] bg-white rounded-t-2xl max-h-[90vh] flex flex-col shadow-2xl"
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
              <p className="text-sm text-gray-500 mt-1">{requests.length} درخواست</p>
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
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
          {requests.length > 0 ? (
            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-base mb-2">{request.title}</h4>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{request.description}</p>
                      <div className="flex items-center gap-3 text-xs flex-wrap">
                        <span className="bg-black text-white px-3 py-1 rounded-full font-medium">
                          {request.type}
                        </span>
                        <span className="text-gray-500">{formatDate(request.date)}</span>
                      </div>
                    </div>
                    <div className="bg-black text-white px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap">
                      در انتظار بررسی
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <AiOutlineInbox className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-base font-medium">هیچ درخواستی در انتظار نیست</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RequestsModal

