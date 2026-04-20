"use client";

import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-[#0A0A0A] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#6FC7B5] border-t-transparent rounded-full animate-spin" /></div>,
});

export default function TechStack() {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <section className="relative bg-[#0A0A0A] py-24 md:py-32 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <div
            className="relative cursor-default mb-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl lg:text-7xl font-sans font-bold text-white tracking-tight leading-tight"
            >
              <div className="relative flex flex-col items-center overflow-hidden h-[1.1em]">
                <div className="flex">
                  {"My Tech Stack".split("").map((char, i) => (
                    <motion.span
                      key={`top-${i}`}
                      className="inline-block"
                      animate={{ y: isHovered ? "-100%" : "0%" }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.02,
                        ease: [0.76, 0, 0.24, 1],
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </div>
                <div className="flex absolute top-[100%]">
                  {"My Tech Stack".split("").map((char, i) => (
                    <motion.span
                      key={`bot-${i}`}
                      className="inline-block text-[#6FC7B5]"
                      animate={{ y: isHovered ? "-100%" : "0%" }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.02,
                        ease: [0.76, 0, 0.24, 1],
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#9CA3AF] font-sans text-lg max-w-2xl"
          >
            A collection of tools and technologies I use to build scalable backend systems
            and intelligent machine learning solutions.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-5xl mx-auto bg-[rgba(20,20,20,0.6)] border border-white/[0.08] rounded-[40px] overflow-hidden backdrop-blur-xl shadow-2xl"
          style={{ height: '600px' }}
        >
          {/* Subtle glow behind scene */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[#6FC7B5]/8 blur-[120px] pointer-events-none" />

          <Spline
            scene="https://prod.spline.design/mHGR0gYfOVzo5ItK/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
