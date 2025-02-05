"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SurpriseRevealProps {
  onReveal: () => void;
}

export default function SurpriseReveal({ onReveal }: SurpriseRevealProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <motion.div
      key="surprise"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-[#111111] flex items-center justify-center overflow-hidden"
      onClick={() => setShowEasterEgg(true)}
    >
      {/* Partículas de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            animate={{
              x: [
                mousePosition.x + Math.random() * 200 - 100,
                mousePosition.x + Math.random() * 200 - 100,
              ],
              y: [
                mousePosition.y + Math.random() * 200 - 100,
                mousePosition.y + Math.random() * 200 - 100,
              ],
              scale: [0.5, 1, 0.5],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 text-center p-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl mb-4"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            {getGreeting()}! 💝
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-2">
            Alguém preparou algo especial para você...
          </p>
          <p className="text-white/60 text-base md:text-lg">
            Uma mensagem única feita com carinho
          </p>
        </motion.div>

        {/* Coração animado */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-32 h-32 mx-auto mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse" />
          <div className="relative w-full h-full flex items-center justify-center">
            <span className="text-7xl">💝</span>
          </div>
        </motion.div>

        {/* Botão de revelar */}
        <motion.button
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={() => {
            setShowEasterEgg(false);
            onReveal();
          }}
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg blur group-hover:blur-xl transition-all duration-300" />
          <div className="relative px-6 py-3 bg-gradient-to-r from-red-600/90 to-pink-600/90 rounded-lg backdrop-blur-sm text-white font-medium text-lg">
            <span className="inline-flex items-center gap-2">
              Revelar Surpresa
              <motion.span
                animate={{ rotate: isHovering ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                ✨
              </motion.span>
            </span>
          </div>
        </motion.button>

        {/* Easter egg - corações flutuantes */}
        <AnimatePresence>
          {showEasterEgg && (
            <>
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 1,
                    scale: 0,
                    x: mousePosition.x,
                    y: mousePosition.y
                  }}
                  animate={{ 
                    opacity: 0,
                    scale: 1,
                    x: mousePosition.x + (Math.random() - 0.5) * 200,
                    y: mousePosition.y - 200 * Math.random()
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="fixed text-2xl pointer-events-none"
                  onAnimationComplete={() => setShowEasterEgg(false)}
                >
                  ❤️
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
