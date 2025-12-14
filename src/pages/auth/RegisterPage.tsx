import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { registerParent, requestOTP } from '../../services/authService';

const RegisterPage = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone;
  const otp = location.state?.otp;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalId: '',
    otp: otp || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [otpSent, setOtpSent] = useState(!!otp);

  useEffect(() => {
    if (!phone) {
      navigate('/login');
    }
  }, [phone, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError('');
  };

  const handleRequestOTP = async () => {
    if (!phone) return;
    
    setLoading(true);
    setError('');
    try {
      await requestOTP(phone);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'خطا در ارسال کد تایید');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.nationalId || formData.nationalId.length < 10) {
      setError('کد ملی معتبر نیست');
      return;
    }
    
    if (!formData.otp || formData.otp.length < 6) {
      setError('کد تایید باید 6 رقم باشد');
      return;
    }
    
    if (!formData.firstName || !formData.lastName) {
      setError('نام و نام خانوادگی الزامی است');
      return;
    }
    
    setLoading(true);
    try {
      const response = await registerParent({
        national_id: formData.nationalId,
        mobile_number: phone!,
        otp: formData.otp,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      
      // Handle login with user data and token storage
      await handleLogin(response);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'خطا در ثبت نام');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="تکمیل اطلاعات"
      subtitle={`برای شماره ${phone} حساب کاربری بسازید`}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              نام
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-300 outline-none transition-all"
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              نام خانوادگی
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-300 outline-none transition-all"
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">
            کد ملی
          </label>
          <input
            type="text"
            id="nationalId"
            value={formData.nationalId}
            onChange={(e) => {
              setFormData({ ...formData, nationalId: e.target.value.replace(/\D/g, '').slice(0, 10) });
              setError('');
            }}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-300 outline-none transition-all text-left"
            dir="ltr"
            maxLength={10}
            disabled={loading}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
            کد تایید
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="otp"
              value={formData.otp}
              onChange={(e) => {
                setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '').slice(0, 6) });
                setError('');
              }}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-300 outline-none transition-all text-center tracking-widest text-lg"
              placeholder="------"
              dir="ltr"
              maxLength={6}
              disabled={loading}
              required
            />
            {!otpSent && (
              <button
                type="button"
                onClick={handleRequestOTP}
                disabled={loading}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 font-medium rounded-xl transition-all whitespace-nowrap"
              >
                ارسال کد
              </button>
            )}
          </div>
          {otpSent && (
            <button
              type="button"
              onClick={handleRequestOTP}
              disabled={loading}
              className="w-full text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-400"
            >
              ارسال مجدد کد تایید
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-gray-300 transition-all active:scale-[0.98] mt-4"
        >
          {loading ? 'در حال ثبت نام...' : 'ثبت نام و ورود'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
