import { FC, ReactNode } from "react";

interface MobileContainerProps {
  children: ReactNode;
}

const MobileContainer: FC<MobileContainerProps> = ({ children }) => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div className='relative w-[375px] h-[812px] rounded-3xl shadow-2xl border-5 overflow-hidden bg-gray-100'>
        {/* Simulated Notch */}
        <div className='absolute top-0 left-1/2 transform -translate-x-1/2 bg-black w-32 h-4 rounded-b-lg'></div>
        {/* Content Area */}
        <div className='pt-8 px-4 h-full'>{children}</div>
      </div>
    </div>
  );
};

export default MobileContainer;
