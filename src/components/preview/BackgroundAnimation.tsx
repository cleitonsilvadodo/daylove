"use client";

import React from "react";
import { AnimationType } from "@/types/form";

interface BackgroundAnimationProps {
  type: AnimationType;
}

export default function BackgroundAnimation({ type }: BackgroundAnimationProps) {
  if (type === "none") return null;

  const renderAnimation = () => {
    switch (type) {
      case "hearts":
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ perspective: "1000px" }}>
            <div className="hearts-animation">
              {Array.from({ length: 20 }).map((_, i) => {
                const size = Math.random() < 0.3 ? 'large' : Math.random() < 0.6 ? 'medium' : 'small';
                const sizes = {
                  small: 16,
                  medium: 24,
                  large: 32
                };
                const rotateY = Math.random() * 360;
                const rotateX = Math.random() * 360;
                // Alternando entre vermelho vivo e rosa claro
                const colors = [
                  "#ef4444", // Vermelho vivo
                  "#ff6b6b", // Vermelho mais claro
                  "#ff8787", // Rosa avermelhado
                  "#ffa4a4"  // Rosa claro
                ];
                const color = colors[Math.floor(Math.random() * colors.length)];
                return (
                  <div
                    key={i}
                    className="heart"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${i * 0.8}s`,
                      animationDuration: `${6 + Math.random() * 4}s`,
                      opacity: 0.7 + Math.random() * 0.3,
                      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                      color: color
                    }}
                  >
                    <svg
                      width={sizes[size]}
                      height={sizes[size]}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ 
                        filter: 'drop-shadow(2px 4px 6px rgba(239, 68, 68, 0.5))',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                );
              })}
            </div>
            <style jsx>{`
              .hearts-animation {
                position: absolute;
                width: 100%;
                height: 100%;
                transform-style: preserve-3d;
              }
              .heart {
                position: absolute;
                top: -20px;
                animation: fall-heart ease-in-out infinite;
                transform-style: preserve-3d;
                will-change: transform;
              }
              @keyframes fall-heart {
                0% {
                  transform: translate3d(0, -20px, 0) rotateX(0deg) rotateY(0deg) scale(1);
                  opacity: 0;
                }
                10% {
                  opacity: var(--opacity, 0.8);
                }
                50% {
                  transform: translate3d(0, 60vh, 100px) rotateX(360deg) rotateY(360deg) scale(1);
                }
                100% {
                  transform: translate3d(0, 120vh, 0) rotateX(720deg) rotateY(720deg) scale(0.8);
                  opacity: 0;
                }
              }
            `}</style>
          </div>
        );

      case "aurora":
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            <div className="aurora-animation">
              <div className="aurora-band"></div>
              <div className="aurora-band"></div>
            </div>
            <style jsx>{`
              .aurora-animation {
                position: absolute;
                width: 100%;
                height: 100%;
                overflow: hidden;
                background: transparent;
              }
              .aurora-band {
                position: absolute;
                width: 200%;
                height: 100%;
                background: linear-gradient(
                  90deg,
                  rgba(0, 255, 255, 0.05) 0%,
                  rgba(238, 130, 238, 0.05) 50%,
                  rgba(0, 255, 255, 0.05) 100%
                );
                filter: blur(30px);
                animation: aurora 40s linear infinite;
                transform: translate3d(0, 0, 0);
              }
              .aurora-band:nth-child(1) {
                top: 0;
                animation-delay: 0s;
              }
              .aurora-band:nth-child(2) {
                top: 50%;
                animation-delay: -20s;
              }
              @keyframes aurora {
                0% {
                  transform: translate3d(-50%, 0, 0) rotate(0deg);
                }
                100% {
                  transform: translate3d(-50%, 0, 0) rotate(360deg);
                }
              }
            `}</style>
          </div>
        );

      case "stars-meteors":
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="stars-meteors-animation">
              {/* Estrelas fixas */}
              <div className="stars-layer">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="star"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 3}s`,
                      opacity: 0.3 + Math.random() * 0.4,
                      width: Math.random() < 0.3 ? '3px' : '1px',
                      height: Math.random() < 0.3 ? '3px' : '1px',
                    }}
                  />
                ))}
              </div>
              {/* Meteoros */}
              <div className="meteors-layer">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={`meteor-${i}`}
                    className="meteor"
                    style={{
                      animationDelay: `${i * 4}s`,
                      top: `${Math.random() * 50}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                  />
                ))}
              </div>
            </div>
            <style jsx>{`
              .stars-meteors-animation {
                position: absolute;
                width: 100%;
                height: 100%;
                background: transparent;
                perspective: 300px;
                transform-style: preserve-3d;
              }
              .stars-layer {
                position: absolute;
                width: 100%;
                height: 100%;
              }
              .star {
                position: absolute;
                background: #fff;
                border-radius: 50%;
                box-shadow: 0 0 3px rgba(255, 255, 255, 0.3);
                animation: twinkle 2s ease-in-out infinite;
                will-change: opacity;
              }
              .meteors-layer {
                position: absolute;
                width: 100%;
                height: 100%;
                transform: rotate(-45deg);
              }
              .meteor {
                position: absolute;
                width: 2px;
                height: 2px;
                background: #fff;
                transform: rotate(45deg);
                will-change: transform;
                animation: meteor 6s linear infinite;
              }
              .meteor::before {
                content: '';
                position: absolute;
                width: 100px;
                height: 1px;
                background: linear-gradient(90deg, rgba(255,255,255,0.8), transparent);
                transform: translateX(-100%);
              }
              @keyframes twinkle {
                0%, 100% {
                  opacity: var(--opacity, 0.3);
                  transform: scale(1);
                }
                50% {
                  opacity: 1;
                  transform: scale(1.2);
                }
              }
              @keyframes meteor {
                0% {
                  transform: translate3d(0, 0, 0) rotate(45deg) scale(0);
                  opacity: 0;
                }
                1% {
                  opacity: 1;
                  transform: translate3d(0, 0, 0) rotate(45deg) scale(1);
                }
                15% {
                  opacity: 1;
                }
                25% {
                  opacity: 0;
                }
                100% {
                  transform: translate3d(150vh, 150vh, 0) rotate(45deg) scale(0.2);
                  opacity: 0;
                }
              }
            `}</style>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0">
      {renderAnimation()}
    </div>
  );
}
