import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {

  return (
    <div className="min-h-screen flex flex-col bg-[#359C67]" dir="rtl">
      {/* Green Top Section with Logo */}
      <div className="bg-[#359C67] w-full flex items-center justify-center py-32">
        <img 
          src={`${import.meta.env.BASE_URL}icon/parentlogo2.svg`} 
          alt="Logo" 
          className="w-32 h-32 object-contain"
        />
      </div>

      {/* White Content Section with rounded top */}
      <div className="flex-1 bg-white rounded-t-3xl flex flex-col items-center justify-center px-4 pt-8">
        {/* Title and Subtitle */}
        <div className="mb-8 text-center flex items-center justify-center flex-col">
          <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>

        {/* Content */}
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
