import React from 'react';
import { Sparkles } from 'lucide-react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 w-full min-h-[350px]">
      <div className="relative group">
        
        {/* Outer Glow (Static Blur) */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-xl blur-md opacity-25 group-hover:opacity-50 transition duration-500"></div>

        {/* Main Frame Container */}
        <div className="relative w-80 h-40 bg-white rounded-xl overflow-hidden flex items-center justify-center p-[4px] shadow-2xl ring-1 ring-slate-100">
            
            {/* The Spinning RGB Border Layer */}
            <div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,#ef4444,#eab308,#22c55e,#06b6d4,#3b82f6,#a855f7,#ef4444)]"></div>

            {/* Inner Content Box (Masks the center) */}
            <div className="relative w-full h-full bg-white rounded-[9px] flex flex-col items-center justify-center z-10 p-6">
                
                <div className="mb-3 relative">
                   <div className="absolute inset-0 bg-yellow-400/30 blur-xl rounded-full animate-pulse"></div>
                   <Sparkles className="text-yellow-500 w-8 h-8 animate-[bounce_2s_infinite] relative z-10" />
                </div>

                <h3 className="text-xl font-bold font-sans text-slate-800 tracking-wide drop-shadow-sm">
                  กำลังหาคำผิดให้อยู่นะควัฟ
                </h3>
                
                {/* Decorative Loading Dots */}
                <div className="flex gap-1.5 mt-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-[bounce_1s_infinite] delay-0"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-[bounce_1s_infinite] delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-[bounce_1s_infinite] delay-200"></div>
                </div>
                
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;