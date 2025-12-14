import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { requestOTP, login } from '../../services/authService';

const LoginPage = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  
  // Check if user has seen onboarding
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (!onboardingCompleted) {
      navigate('/onboarding', { replace: true });
    }
  }, [navigate]);
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [otpSent, setOtpSent] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (phone.length < 10) {
      setError('شماره موبایل معتبر نیست');
      return;
    }
    
    setLoading(true);
    try {
      await requestOTP(phone);
      setOtpSent(true);
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'خطا در ارسال کد تایید');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (otp.length < 6) {
      setError('کد تایید باید 6 رقم باشد');
      return;
    }
    
    setLoading(true);
    try {
      const response = await login({
        loginType: 'MOBILE_OTP',
        otpCredentials: {
          mobileNumber: phone,
          otp: otp,
        },
      });
      
      // Handle login with user data and token storage
      await handleLogin(response);
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'کد تایید نامعتبر است';
      const statusCode = err.response?.status;
      const errorCode = err.response?.data?.error_code;
      
      // If status 428 with REGISTRATION_REQUIRED, or user not found (404), or unauthorized (401), navigate to register
      if (
        (statusCode === 428 && errorCode === 'REGISTRATION_REQUIRED') ||
        statusCode === 404 ||
        statusCode === 401 ||
        errorMessage.includes('ثبت نام') ||
        errorMessage.includes('registration required') ||
        errorMessage.includes('یافت نشد') ||
        errorMessage.includes('not found')
      ) {
        navigate('/register', { state: { phone, otp } });
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendOTP = async () => {
    setError('');
    setLoading(true);
    try {
      await requestOTP(phone);
      setOtpSent(true);
      setOtp('');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'خطا در ارسال مجدد کد تایید');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === 'phone' ? "ورود یا ثبت نام" : "کد تایید را وارد کنید"}
      subtitle={step === 'phone' ? "شماره موبایل خود را وارد کنید" : `کد تایید برای شماره ${phone} ارسال شد`}
    >
      {step === 'phone' ? (
        <form className="space-y-6" onSubmit={handlePhoneSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              شماره موبایل
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-300 outline-none transition-all text-left"
              placeholder="09123456789"
              dir="ltr"
              disabled={loading}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-gray-300 transition-all active:scale-[0.98]"
          >
            {loading ? 'در حال ارسال...' : 'ادامه'}
          </button>
        </form>
      ) : (
        <form className="space-y-6" onSubmit={handleOtpSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          {otpSent && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              کد تایید ارسال شد
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              کد تایید
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                setError('');
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-gray-300 outline-none transition-all text-center tracking-widest text-lg"
              placeholder="------"
              dir="ltr"
              maxLength={6}
              disabled={loading}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-gray-300 transition-all active:scale-[0.98]"
          >
            {loading ? 'در حال بررسی...' : 'تایید و ادامه'}
          </button>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="w-full text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-400"
            >
              ارسال مجدد کد تایید
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError('');
                setOtpSent(false);
              }}
              disabled={loading}
              className="w-full text-sm text-gray-500 hover:text-gray-700 disabled:text-gray-400"
            >
              ویرایش شماره موبایل
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default LoginPage;
