"use client";

import React, { useState, useEffect } from 'react';

export default function AnimatedLogo() {
  const [isQRCode, setIsQRCode] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsQRCode(prev => !prev);
    }, 6000); // Alterna a cada 6 segundos para uma transição mais suave

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      {/* Efeito de brilho de fundo */}
      <div className="absolute w-32 h-32 bg-gradient-to-r from-red-500/10 via-pink-500/20 to-purple-500/10 rounded-full animate-pulse blur-xl"></div>
      
      {/* Container 3D */}
      <div className={`relative w-32 h-32 transform-gpu animate-rotate-3d preserve-3d transition-transform duration-1000`}>
        {/* Face do Coração */}
        <div className={`absolute inset-0 backface-hidden transition-all duration-1500 ease-in-out ${isQRCode ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-24 h-24">
              {/* Coração com efeito 3D */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-pink-600 animate-morph rounded-[30%_70%_70%_30%/30%_30%_70%_70%] shadow-lg transform hover:scale-105 transition-transform">
                <div className="absolute inset-1 bg-gradient-to-tr from-red-500 to-pink-500 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-morph">
                  {/* Reflexo */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-sm"></div>
                </div>
              </div>
              
              {/* Partículas */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full animate-particle"
                  style={{
                    top: '50%',
                    left: '50%',
                    '--tw-translate-x': `${Math.cos(i * Math.PI/3) * 50}px`,
                    '--tw-translate-y': `${Math.sin(i * Math.PI/3) * 50}px`,
                    animationDelay: `${i * 0.5}s`
                  } as any}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Face do QR Code */}
        <div className={`absolute inset-0 backface-hidden transition-all duration-1500 ease-in-out ${isQRCode ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-24 h-24">
              <div className={`w-full h-full bg-gradient-to-br from-pink-500 to-red-500 p-1 transition-all duration-1000 ${isQRCode ? 'rounded-lg' : 'rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-morph'}`}>
                <div className={`w-full h-full bg-white p-2 transition-all duration-1000 ${isQRCode ? 'rounded-md' : 'rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-morph'}`}>
                  {/* QR Code estilizado */}
                  <div className={`w-full h-full grid grid-cols-4 grid-rows-4 gap-1 transition-all duration-1000 ${isQRCode ? 'opacity-100' : 'opacity-0'}`}>
                    {[...Array(16)].map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`}
                      />
                    ))}
                  </div>
                  
                  {/* Cantos do QR Code */}
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`absolute w-4 h-4 border-2 border-red-500 transition-all duration-1000 ${isQRCode ? 'opacity-100' : 'opacity-0'}`}
                      style={{
                        top: i === 0 ? '2px' : i === 1 ? '2px' : 'auto',
                        left: i === 0 ? '2px' : i === 1 ? 'auto' : '2px',
                        right: i === 1 ? '2px' : 'auto',
                        bottom: i === 2 ? '2px' : 'auto',
                      }}
                    />
                  ))}

                  {/* Forma de coração sobreposta */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br from-red-400 to-pink-600 transition-all duration-1000 ${isQRCode ? 'opacity-0' : 'opacity-100'} rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-morph`}
                    style={{
                      clipPath: 'path("M0,-20 C-20,-20 -30,10 0,30 C30,10 20,-20 0,-20")'
                    }}
                  >
                    <div className="absolute inset-1 bg-gradient-to-tr from-red-500 to-pink-500 rounded-[30%_70%_70%_30%/30%_30%_70%_70%] animate-morph">
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilo para perspectiva 3D */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
}
