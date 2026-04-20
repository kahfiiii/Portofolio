"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { supabase } from '../lib/supabase';
import { Trophy, Maximize2, X } from 'lucide-react';

export default function Certifications() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [certsHovered, setCertsHovered] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const [targetRef, setTargetRef] = useState(null);
  const dragRef = useRef(null);

  // Dynamic height calculation: 100vh base + proportional scroll room
  // Capped between 150vh and 400vh to ensure it's never too short or too long
  const certCountHeight = loading ? 300 : Math.min(Math.max(150, 100 + (certs.length * 15)), 400);

  const { scrollYProgress } = useScroll({
    target: targetRef ? { current: targetRef } : undefined,
    offset: ["start end", "end start"]
  });

  // Precise mapping: 
  // We want to scroll from 0 to -(totalContentWidth - viewportWidth)
  // We'll estimate based on cards or use containerWidth state
  // Refined mapping to ensure the last card stops at the right edge
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${Math.max(0, certs.length - 3) * 15}%`]);

  useEffect(() => {
    async function fetchCerts() {
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCerts(data || []);
      } catch (err) {
        console.error('Error fetching certificates:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCerts();
  }, []);

  if (loading && certs.length === 0) return null;

  return (
    <section
      ref={setTargetRef}
      className="relative bg-[#0A0A0A] border-t border-white/5"
      style={{ height: `${certCountHeight}vh` }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-[#6FC7B5]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-white/5 blur-[120px] rounded-full" />

        <div className="max-w-[1500px] mx-auto px-4 md:px-8 lg:px-12 relative z-10 w-full mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div
                className="relative cursor-default"
                onMouseEnter={() => setCertsHovered(true)}
                onMouseLeave={() => setCertsHovered(false)}
              >
                <h2 className="text-3xl md:text-5xl font-sans font-bold text-white tracking-tight leading-[1.1]">
                  <div className="relative flex flex-col items-start overflow-hidden h-[1.1em]">
                    <div className="flex">
                      {"Professional".split("").map((char, i) => (
                        <motion.span
                          key={`top-${i}`}
                          className="inline-block"
                          animate={{ y: certsHovered ? "-100%" : "0%" }}
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
                      {"Professional".split("").map((char, i) => (
                        <motion.span
                          key={`bot-${i}`}
                          className="inline-block text-[#6FC7B5]"
                          animate={{ y: certsHovered ? "-100%" : "0%" }}
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
                  <div className="mt-1">Certifications</div>
                </h2>
              </div>
            </div>
            <p className="max-w-md text-white/40 font-sans leading-relaxed text-sm md:text-base hidden md:block">
              A collection of certifications and milestones achieved throughout my career.
            </p>
          </div>
        </div>

        {/* Horizontal Scrolling Certificates */}
        <div ref={dragRef} className="relative flex items-center cursor-grab active:cursor-grabbing">
          <motion.div
            drag="x"
            dragConstraints={dragRef}
            dragElastic={0.1}
            style={{ x }}
            className="flex gap-6 px-4 md:px-8 lg:px-12"
          >
            {certs.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="group relative flex-shrink-0 w-[80vw] md:w-[450px] aspect-[4/3] bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-[#6FC7B5]/30 transition-colors shadow-2xl"
              >
                <Image
                  src={cert.img}
                  alt="Certificate"
                  fill
                  className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 pointer-events-none"
                  sizes="(max-width: 768px) 100vw, 450px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

                <div
                  className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(cert.img);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-[#6FC7B5]/20 transition-colors">
                      <Maximize2 size={18} className="text-white" />
                    </div>
                    <span className="text-white text-sm font-sans font-medium">View Full Certificate</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Lightbox / Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              whileHover={{ rotate: 90 }}
            >
              <X size={32} />
            </motion.button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full h-full max-w-6xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src={selectedImage}
                  alt="Certificate Full"
                  fill
                  className="object-contain"
                  quality={100}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
