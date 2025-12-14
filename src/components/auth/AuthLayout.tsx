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
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-black rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-gray-300">
           {/* Placeholder for Logo Icon */}
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
             <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
             <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 002.322-.446z" />
           </svg>
        </div>
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
