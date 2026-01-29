import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 font-sans" dir="rtl">
      {/* Logo Area */}
      <div className="mb-8 text-center flex items-center justify-center flex-col">
       <img src={`${import.meta.env.BASE_URL}icon/parent-logo.svg`} alt="" className='mb-6 rounded-2xl w-24' />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>


      {/* Content */}
      <div className="w-full max-w-sm">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
