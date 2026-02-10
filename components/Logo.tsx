
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 'md', showText = true }) => {
  // Mapping sizes for the container
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-24 h-24',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  // Text sizes for the bottom branding
  const textScale = {
    sm: 'text-[8px]',
    md: 'text-sm',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* The Circular Badge Design */}
      <div className={`relative rounded-full bg-[#03045E] shadow-xl overflow-hidden flex items-center justify-center ${sizeMap[size]}`}>
        {/* Large White 'C' */}
        <span 
          className="absolute font-serif text-white leading-none select-none"
          style={{ 
            fontSize: size === 'sm' ? '30px' : size === 'md' ? '80px' : size === 'lg' ? '160px' : '220px',
            fontWeight: 900,
            left: '12%',
            top: '48%',
            transform: 'translateY(-50%)'
          }}
        >
          C
        </span>

        {/* Overlapping Orange 'S' */}
        <span 
          className="absolute font-serif text-[#FB8500] leading-none select-none"
          style={{ 
            fontSize: size === 'sm' ? '22px' : size === 'md' ? '60px' : size === 'lg' ? '120px' : '160px',
            fontWeight: 900,
            right: '15%',
            bottom: '15%',
            zIndex: 10
          }}
        >
          S
        </span>

        {/* Bridge Silhouette */}
        <svg 
          viewBox="0 0 200 100" 
          className="absolute w-full h-auto bottom-[20%] left-0 z-20 pointer-events-none opacity-90"
        >
          <path d="M0 80 Q 100 70 200 80" stroke="black" strokeWidth="4" fill="none" />
          <path d="M0 84 Q 100 74 200 84" stroke="black" strokeWidth="2" fill="none" />
          <path d="M60 80 L60 20" stroke="black" strokeWidth="3" />
          <path d="M140 80 L140 20" stroke="black" strokeWidth="3" />
          <path d="M60 20 L20 80" stroke="black" strokeWidth="0.5" opacity="0.6" />
          <path d="M60 20 L40 80" stroke="black" strokeWidth="0.5" opacity="0.6" />
          <path d="M60 20 L80 80" stroke="black" strokeWidth="0.5" opacity="0.6" />
          <path d="M60 20 L100 80" stroke="black" strokeWidth="0.5" opacity="0.6" />
          <path d="M140 20 L100 80" stroke="black" strokeWidth="0.5" opacity="0.6" />
          <path d="M140 20 L120 80" stroke="black" strokeWidth="0.5" opacity="0.6" />
          <path d="M140 20 L160 80" stroke="black" strokeWidth="0.5" opacity="0.6" />
          <path d="M140 20 L180 80" stroke="black" strokeWidth="0.5" opacity="0.6" />
        </svg>
      </div>

      {/* Bottom Branding Text - Updated to CONNECT∀SETU */}
      {showText && (
        <div className={`mt-3 font-black italic tracking-tighter flex items-center ${textScale[size]}`}>
          <span className="text-[#FF4D00] uppercase">CONNECT</span>
          <span className="text-[#94A3B8] mx-0.5 leading-none not-italic flex items-center justify-center font-sans" style={{ fontSize: '1.15em' }}>
            ∀
          </span>
          <span className="text-[#03045E] uppercase">SETU</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
