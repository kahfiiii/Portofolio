"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const WORDS = [
  "Hello",
  "Halo",
  "Hola",
  "Ciao",
  "Olá",
  "Bonjour",
  "こんにちは",
  "مرحبا"
];

export default function IntroSplash() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Check if splash has been shown in current session
    const splashShown = sessionStorage.getItem("splashShown");
    if (!splashShown) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    if (index === WORDS.length - 1) {
      setTimeout(() => {
        setVisible(false);
        // Mark as shown for this session
        sessionStorage.setItem("splashShown", "true");
      }, 800);
      return;
    }

    const timeout = setTimeout(() => {
      setIndex(index + 1);
    }, index === 0 ? 1000 : 150);

    return () => clearTimeout(timeout);
  }, [index, visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="splash"
          className="fixed inset-0 bg-[#000000] z-[1000] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-130vh",
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
          }}
        >
          {/* Dynamic SVG Curve tail */}
          <div className="absolute top-[100%] left-0 w-full overflow-visible">
            <svg 
              className="w-full h-auto fill-[#000000]" 
              viewBox="0 0 1440 300" 
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path 
                initial={{ d: "M 0 0 Q 720 0 1440 0 L 1440 0 L 0 0 Z" }}
                exit={{ 
                  d: "M 0 0 Q 720 300 1440 0 L 1440 0 L 0 0 Z",
                  transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
                }}
              />
            </svg>
          </div>

          <div className="relative">
            <motion.p
              key={WORDS[index]}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
              className="text-white text-4xl md:text-6xl lg:text-7xl font-display font-medium flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white mr-4" />
              {WORDS[index]}
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
