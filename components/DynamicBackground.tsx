import React, { useState, useEffect } from 'react';

export const DynamicBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getLayerStyle = (factor: number) => ({
    transform: `translate(${mousePos.x * factor}px, ${mousePos.y * factor}px)`,
    transition: 'transform 0.15s ease-out',
  });

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#4d1f0e]">
      {/* Sky Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f9d481] via-[#e68c4a] to-[#4d1f0e]" />

      {/* Sun/Light Glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-300/20 blur-[120px] rounded-full"
        style={getLayerStyle(5)}
      />

      {/* Distant Mountains */}
      <div 
        className="absolute bottom-[35%] w-[120%] left-[-10%] h-[30%] opacity-30 pointer-events-none"
        style={getLayerStyle(8)}
      >
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full fill-[#8d4d2d]">
          <path d="M0,300 L150,120 L350,250 L600,80 L850,220 L1000,100 L1000,300 Z" />
        </svg>
      </div>

      {/* Nearer Mountains */}
      <div 
        className="absolute bottom-[28%] w-[115%] left-[-7.5%] h-[35%] opacity-50 pointer-events-none"
        style={getLayerStyle(15)}
      >
        <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full fill-[#6b341a]">
          <path d="M0,300 L100,180 L300,280 L500,150 L800,250 L1000,200 L1000,300 Z" />
        </svg>
      </div>

      {/* The Palace Layer */}
      <div 
        className="absolute bottom-[22%] left-0 w-full h-[55%] flex justify-center items-end pointer-events-none"
        style={getLayerStyle(25)}
      >
        <div className="relative w-[90%] max-w-5xl h-full">
          {/* Detailed Palace SVG */}
          <svg viewBox="0 0 1000 500" className="w-full h-full drop-shadow-2xl">
            {/* Palace Base */}
            <rect x="150" y="350" width="700" height="150" fill="#f2bc43" />
            <rect x="150" y="340" width="700" height="10" fill="#e5a133" />
            
            {/* Center Gate Section */}
            <rect x="400" y="220" width="200" height="140" fill="#f2bc43" />
            <path d="M400,220 Q500,160 600,220" fill="#f2bc43" />
            <path d="M440,360 L440,280 Q500,220 560,280 L560,360 Z" fill="#4d1f0e" />
            
            {/* Left Tower */}
            <rect x="250" y="240" width="100" height="110" fill="#f2bc43" />
            <path d="M250,240 Q300,180 350,240" fill="#f2bc43" />
            <circle cx="300" cy="190" r="10" fill="#e5a133" />
            
            {/* Right Tower */}
            <rect x="650" y="240" width="100" height="110" fill="#f2bc43" />
            <path d="M650,240 Q700,180 750,240" fill="#f2bc43" />
            <circle cx="700" cy="190" r="10" fill="#e5a133" />

            {/* Small Arches on Base */}
            {[...Array(10)].map((_, i) => (
              <path key={i} d={`M${180 + i * 65},350 L${180 + i * 65},380 Q${205 + i * 65},360 ${230 + i * 65},380 L${230 + i * 65},350 Z`} fill="#8d4d2d" />
            ))}
          </svg>
        </div>
      </div>

      {/* Water & Reflection */}
      <div className="absolute bottom-0 left-0 w-full h-[25%] overflow-hidden">
        {/* Water Surface */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#4d1f0e] to-[#e68c4a]/40" />
        
        {/* Palace Reflection */}
        <div 
          className="absolute top-0 left-0 w-full h-[200%] opacity-20 scale-y-[-1] blur-[2px]"
          style={getLayerStyle(25)}
        >
          <div className="relative w-full h-1/2 flex justify-center items-end">
             <div className="w-[90%] max-w-5xl h-full">
                <svg viewBox="0 0 1000 500" className="w-full h-full fill-[#f2bc43]">
                  <rect x="150" y="350" width="700" height="150" />
                  <rect x="400" y="220" width="200" height="140" />
                  <rect x="250" y="240" width="100" height="110" />
                  <rect x="650" y="240" width="100" height="110" />
                </svg>
             </div>
          </div>
        </div>

        {/* Dynamic Ripples */}
        <div className="absolute inset-0 opacity-40">
           <div className="ripple-line top-4 left-1/4 w-[200px]" />
           <div className="ripple-line top-10 left-1/2 w-[300px]" style={{ animationDelay: '1s' }} />
           <div className="ripple-line top-20 right-1/4 w-[150px]" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Scalloped Archway Frame (The Jharokha style) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 1000 1000" className="w-full h-full fill-[#5c2a18]">
          <path 
            fillRule="evenodd"
            d="M0,0 L1000,0 L1000,1000 L0,1000 Z 
               M500,100 
               Q550,100 580,130 Q610,100 660,100
               Q710,100 740,130 Q770,100 820,100
               Q870,100 900,150 L900,850
               L100,850 L100,150
               Q130,100 180,100 Q230,100 260,130
               Q290,100 340,100 Q390,100 420,130
               Q450,100 500,100 Z"
            style={{ 
              transform: `scale(${1 + mousePos.y * 0.01})`,
              transformOrigin: 'center center'
            }}
          />
          {/* Decorative bottom border */}
          {[...Array(12)].map((_, i) => (
             <path 
               key={i} 
               d={`M${50 + i * 83},900 Q${50 + i * 83 + 41},850 ${50 + i * 83 + 83},900 L${50 + i * 83 + 83},950 L${50 + i * 83},950 Z`} 
               fill="#4d1f0e" 
             />
          ))}
        </svg>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .ripple-line {
          position: absolute;
          height: 1px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 100%;
          filter: blur(2px);
          animation: ripple-move 4s linear infinite;
        }
        @keyframes ripple-move {
          0% { transform: translateX(-50px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(50px); opacity: 0; }
        }
      `}} />
    </div>
  );
};
