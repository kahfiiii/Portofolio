"use client";

import React, { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Dynamically import Spline ONLY when user clicks "Launch" — not on page load
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

export default function ThreeKeyboard() {
  const [error, setError] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Error fallback
  if (error) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-black/5 rounded-[40px] border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6FC7B5]/5 to-transparent pointer-events-none" />
        <div className="flex flex-col items-center gap-6 text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
            <span className="text-2xl opacity-50">⌨️</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-white/80 font-sans font-bold tracking-tight">3D Module Connection Lost</h3>
            <p className="text-white/40 text-xs font-sans max-w-[280px] leading-relaxed">
              Spline's cloud is currently unreachable from your browser.
              Please check your connection or try again.
            </p>
          </div>
          <button
            onClick={() => { setError(false); setLaunched(false); }}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] uppercase tracking-widest text-white/60 transition-all hover:text-white"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] relative overflow-hidden">

      {/* === PREVIEW STATE (Static image) === */}
      <AnimatePresence>
        {!launched && (
          <motion.div
            key="preview"
            className="absolute inset-0 flex items-center justify-center cursor-pointer group"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Static preview image - no runtime cost */}
            <div className="absolute inset-0">
              <Image
                src="/images/keyboard.png"
                alt="3D Mechanical Keyboard Preview"
                fill
                className="object-contain opacity-70 scale-90"
                priority={false}
              />
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/50 via-transparent to-transparent" />

            {/* Teal glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-[#6FC7B5]/10 blur-[100px] rounded-full pointer-events-none" />

            {/* Launch Button */}
            <motion.button
              onClick={() => setLaunched(true)}
              className="relative z-10 flex flex-col items-center gap-4 group/btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="relative w-20 h-20 flex items-center justify-center">
                {/* Spinning ring */}
                <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 80 80" fill="none">
                  <circle
                    cx="40" cy="40" r="36"
                    stroke="rgba(111,199,181,0.3)"
                    strokeWidth="1"
                    strokeDasharray="6 4"
                  />
                </svg>
                {/* Center circle */}
                <div className="w-14 h-14 rounded-full bg-black border border-[#6FC7B5]/40 flex items-center justify-center group-hover/btn:bg-[#6FC7B5]/10 group-hover/btn:border-[#6FC7B5]/80 transition-all duration-300 shadow-[0_0_20px_rgba(111,199,181,0.2)] group-hover/btn:shadow-[0_0_30px_rgba(111,199,181,0.5)]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#6FC7B5] ml-0.5">
                    <polygon points="5,3 19,12 5,21" fill="currentColor" />
                  </svg>
                </div>
              </div>
              <div className="text-center">
                <div className="text-white/80 text-xs font-sans tracking-[0.3em] uppercase group-hover/btn:text-white transition-colors">
                  Launch 3D View
                </div>
                <div className="text-white/30 text-[10px] font-sans mt-1">
                  ~2MB · Interactive
                </div>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === ACTIVE STATE (Spline only loads after launch click) === */}
      {launched && (
        <motion.div
          key="spline"
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Loading spinner while Spline initializes */}
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-[#6FC7B5]/20 border-t-[#6FC7B5] rounded-full animate-spin" />
                <span className="text-white/20 text-[10px] uppercase tracking-widest font-sans">Initializing 3D Engine...</span>
              </div>
            </div>
          )}

          <Suspense fallback={null}>
            <div className="w-full h-full relative flex items-center justify-center">
              <Spline
                scene="https://prod.spline.design/pHR0bQp310hVzFZu/scene.splinecode"
                className="w-full h-full"
                onLoad={() => setLoaded(true)}
                onError={(e) => {
                  console.error("Spline Load Error:", e);
                  setError(true);
                }}
              />
            </div>
          </Suspense>
        </motion.div>
      )}

      {/* Drag hint (only once loaded) */}
      {launched && loaded && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-30 pointer-events-none">
          <div className="flex flex-col items-center gap-2">
            <div className="w-px h-6 bg-white/20" />
            <span className="text-[8px] uppercase tracking-[0.3em] text-white/40">Drag to Orbit</span>
          </div>
        </div>
      )}
    </div>
  );
}
