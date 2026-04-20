"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView, animate } from "framer-motion";
import { ArrowUpRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import IntroSplash from "./IntroSplash";
import Header from "./Header";
import Magnetic from "./Magnetic";
import { supabase } from "../lib/supabase";

// Dynamic imports for heavy or off-screen components
const Footer = dynamic(() => import("./Footer"), { ssr: true });
const ThreeKeyboard = dynamic(() => import("./ThreeKeyboard"), { ssr: false });

function Counter({ target, duration = 2 }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      animate(count, target, { duration, ease: "easeOut" });
    }
  }, [isInView, count, target, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function HomeContent() {
  const { scrollYProgress: globalScroll } = useScroll();
  const [isScrolling, setIsScrolling] = useState(false);
  
  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const expertiseRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      if (!supabase) {
        console.warn("Supabase client not initialized. Using empty projects.");
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: false })
          .limit(4);
        
        if (error) throw error;
        if (data) setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();

    async function fetchCertificates() {
      if (!supabase) {
        console.warn("Supabase client not initialized. Using empty certificates.");
        setLoadingCerts(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .order('id', { ascending: false })
          .limit(12);
        
        if (error) throw error;
        if (data) setCertificates(data);
      } catch (err) {
        console.error("Error fetching certificates:", err);
      } finally {
        setLoadingCerts(false);
      }
    }
    fetchCertificates();
  }, []);
  const { scrollYProgress: expertiseProgress } = useScroll({
    target: expertiseRef,
    offset: ["start center", "end start"]
  });


  
  // New section-specific scroll targets
  const aboutRef = useRef(null);
  const certSectionRef = useRef(null);
  const { scrollYProgress: aboutScrollProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "start start"]
  });

  const { scrollYProgress: certScrollProgress } = useScroll({
    target: certSectionRef,
    offset: ["start start", "end end"]
  });

  const experienceSecRef = useRef(null);
  const { scrollYProgress: localExpProgress } = useScroll({
    target: experienceSecRef,
    offset: ["start 80%", "end 20%"]
  });

  const expProgress = useTransform(localExpProgress, [0.1, 0.9], [0, 1]);
  // Smooth out the progress for a "premium" slower feel
  const springExpProgress = useSpring(expProgress, { stiffness: 150, damping: 30 });

  // Determine max scroll width and overall width
  const totalCertWidth = certificates.length * 482; // 450 card + 32 gap
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  
  // maxTranslateAll is the absolute end of the content
  const maxTranslateAll = Math.max(0, totalCertWidth - viewportWidth + (viewportWidth * 0.15));
  
  // maxTranslateScroll is the distance covered by vertical scroll (limited to ~6 cards)
  const maxTranslateScroll = Math.min(maxTranslateAll, 6 * 482);

  // Manual offset for buttons
  const manualXOffset = useMotionValue(0);

  // Transform vertical scroll to horizontal shift (linked to maxTranslateScroll)
  const certBaseX = useTransform(certScrollProgress, [0, 1], [0, -maxTranslateScroll]);
  
  // Combine both scroll and manual offsets
  const finalCertX = useTransform([certBaseX, manualXOffset], ([bx, mx]) => {
    const combined = bx + mx;
    // Clamp to the absolute dimensions of the collection
    return Math.max(-maxTranslateAll, Math.min(0, combined));
  });

  // Hero sticky reveal animations (linked to About entrance)
  const heroScale = useTransform(aboutScrollProgress, [0, 1], [1, 0.9]);
  const heroOpacity = useTransform(aboutScrollProgress, [0, 1], [1, 0]);

  // About content hard reveal (appears ONLY when top hits top)
  const aboutContentOpacity = useTransform(aboutScrollProgress, [0.93, 0.99], [0, 1]);
  const aboutContentScale = useTransform(aboutScrollProgress, [0.93, 0.99], [0.95, 1]);
  
  // Transition About from transparent to solid (right before hitting top)
  const aboutBgOpacity = useTransform(aboutScrollProgress, [0.85, 0.98], [0, 1]);

  return (
    <>
      <IntroSplash />
      <Header />

      {/* Fixed bottom-right circle button */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <button className="w-14 h-14 flex items-center justify-center cursor-pointer">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 border-[1.5px] border-white/20 rounded-full" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M4 12C8 12 12 12 16 12C18 12 19 12 20 12" />
            </svg>
          </div>
        </button>
      </div>

      <main className="relative min-h-screen">
        {/* ====== HERO SECTION ====== */}
        <section className="sticky top-0 w-full h-screen flex flex-col items-center justify-start lg:justify-center overflow-hidden bg-[#0A0A0A] pt-28 lg:pt-32 pb-20 z-0">

          {/* Video Background */}
          <div 
            className="absolute inset-0 z-0 flex items-end lg:items-center justify-center"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              fetchPriority="high"
              preload="auto"
              poster="/videos/bghero_poster.jpg"
              className="w-full h-full lg:w-[120vw] lg:h-[120vh] object-contain opacity-40 scale-[3.5] lg:scale-100 translate-y-80 lg:translate-y-0"
            >
              <source src="/videos/bghero_optimized.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Social Sidebar (Left) */}
          <div 
            className="z-50 flex-col flex lg:h-[80vh] h-auto px-5 lg:px-9 pt-[5rem] lg:-mt-3 xl:mt-10 py-5 lg:py-10 items-center left-0 bottom-24 lg:top-25 absolute justify-end lg:justify-between"
          >
            {/* Vertical Line with Progress Indicator */}
            <motion.div 
              animate={{ width: isScrolling ? '3px' : '1px' }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="lg:block hidden lg:mb-14 h-[40vh] bg-white/50 relative overflow-hidden"
            >
              {/* Progress Fill */}
              <motion.div 
                className="absolute top-0 left-0 w-full bg-[#2DD4BF] origin-top shadow-[0_0_8px_rgba(45,212,191,0.5)]"
                style={{ scaleY: aboutScrollProgress, height: '100%' }}
              />
              <div className="absolute bottom-0 right-[50%] transform translate-x-[50%] h-[.3rem] bg-white rounded-[50%] w-[.3rem] z-10" />
              <div className="absolute top-0 right-[50%] transform translate-x-[50%] h-[.3rem] bg-white rounded-[50%] w-[.3rem] z-10" />
            </motion.div>

            {/* Social Icons */}
            <div className="flex z-50 w-full flex-col gap-6 lg:gap-5 xl:gap-8">
              <motion.a
                href="https://www.linkedin.com/in/mohamadsohibulkahfi/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="flex items-center justify-center cursor-pointer text-white/50 hover:text-white transition-colors duration-150"
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="22" width="22" fill="currentColor">
                  <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                </svg>
              </motion.a>

              <motion.a
                href="https://wa.me/6285859341752"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="flex items-center justify-center cursor-pointer text-white/50 hover:text-white transition-colors duration-150"
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="22" width="22" fill="currentColor">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
              </motion.a>

              <motion.a
                href="https://github.com/kahfiiii"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="flex items-center justify-center cursor-pointer text-white/50 hover:text-white transition-colors duration-150"
              >
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" height="22" width="22" fill="currentColor">
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
                </svg>
              </motion.a>
            </div>
          </div>

          {/* Right Side Rotated Name */}
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center h-full z-20"
          >
            <p className="text-white/15 font-bold uppercase tracking-widest text-sm rotate-90 origin-center whitespace-nowrap translate-x-[60%]">
              MOHAMAD SOHIBUL KAHFI
            </p>
          </div>

          {/* Hero Text Content */}
          <div 
            className="relative z-10 flex flex-col items-center text-center px-4 pointer-events-none mt-10 lg:mt-0"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="font-sans text-[1rem] sm:text-[1.2rem] md:text-[1.4rem] lg:text-[1.6rem] text-center mb-1 lg:-mb-1 font-normal text-white/70 gpu-accelerated optimize-motion"
            >
              Hi! i&apos;m Kahfi
            </motion.h1>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-sans text-[1.8rem] sm:text-[2.2rem] md:text-[3rem] lg:text-[4.2rem] xl:text-[5.5rem] pb-1 text-center font-light leading-[1.05] tracking-tight text-white gpu-accelerated optimize-motion"
            >
              Backend Developer
            </motion.h1>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-sans text-[1.8rem] sm:text-[2.2rem] md:text-[3rem] lg:text-[4.2rem] xl:text-[5.5rem] pb-1 text-center font-light leading-[1.05] tracking-tight text-white gpu-accelerated optimize-motion"
            >
              ML Enthusiast.
            </motion.h1>
          </div>

          {/* Scroll Down */}
          <div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                y: [0, 12, 0]
              }}
              transition={{ 
                opacity: { duration: 1, delay: 1.5 },
                y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
              }}
              className="text-lg lg:text-2xl font-light font-sans whitespace-nowrap text-white/40"
            >
              scroll down
            </motion.p>
          </div>
        </section>

        {/* ====== ABOUT SECTION ====== */}
        <section ref={aboutRef} className="relative text-white min-h-screen flex flex-col items-center justify-start z-10 pt-32 pb-20 md:pt-48 md:pb-32">
          {/* Dynamic Background Layer */}
          <motion.div 
            style={{ opacity: aboutBgOpacity }}
            className="absolute inset-0 bg-[#121212] z-0" 
          />
          <motion.div 
            style={{ opacity: aboutContentOpacity, scale: aboutContentScale }}
            className="container mx-auto px-6 py-0 flex flex-col items-center text-center max-w-6xl relative z-10"
          >
            {/* Word-by-word heading */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-14 lg:mb-20 flex flex-wrap justify-center overflow-hidden"
            >
              {`I'm Kahfi — a Backend Developer & Machine Learning Enthusiast building fast, scalable systems and intelligent solutions that power real-world digital experiences.`.split(' ').map((word, i) => (
                <motion.div
                  key={i}
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.03 }}
                  className="overflow-hidden mr-[0.25em] py-1"
                >
                  <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal lg:leading-[1.2] tracking-[-0.01em] text-white">
                    {word}
                  </h2>
                </motion.div>
              ))}
            </motion.div>

            {/* Sub-description word-by-word */}
            <motion.div className="mb-16 max-w-5xl flex flex-wrap justify-center overflow-hidden">
              {`I specialize in backend engineering and machine learning, building robust APIs, data pipelines, and AI-driven features using Python, Node.js, and modern ML frameworks.`.split(' ').map((word, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: "100%" }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.02 }}
                  className="overflow-hidden mr-[0.2em] py-1"
                >
                  <p className="font-sans text-white/80 text-lg md:text-3xl font-normal leading-relaxed tracking-normal">
                    {word}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* About Me Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: 0.5
              }}
            >
              <Magnetic>
                <div 
                  className="cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }} 
                >
                  <RollingButton href="/about-me" text="About Me" />
                </div>
              </Magnetic>
            </motion.div>

            {/* Bottom labels - now relative to stay below content */}
            <div className="w-full mt-32 flex flex-col md:flex-row items-center justify-between gap-8 font-sans text-sm font-normal text-white/40 tracking-wide px-4 md:px-10">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="m19 12-7 7-7-7" /></svg>
                </motion.div>
                Scroll to Explore
              </div>
              <div className="hidden lg:block">
                My Short Story
              </div>
            </div>
          </motion.div>
        </section>

        {/* ====== EXPERTISE + IMAGE SECTION ====== */}
        <section ref={expertiseRef} className="relative h-fit bg-[#0A0A0A] overflow-hidden">
          <div className="relative w-full bg-[#121212] origin-top">

            {/* Green Snake SVG Line */}
            <div className="absolute inset-0 pointer-events-none z-40">
              <svg viewBox="0 0 1000 3800" className="w-full h-full opacity-80" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
                <motion.path
                  d="M 2100 100 C 800 100, 650 200, 650 400 C 650 650, 850 750, 780 950 C 710 1150, 380 1200, 360 1450 C 340 1700, 680 1750, 620 2050 C 560 2350, 200 2360, 280 2600 C 350 2800, 800 2900, 750 3100 C 700 3300, -100 3550, -2500 3600"
                  stroke="#2DD4BF" strokeWidth="35" strokeLinecap="round" strokeLinejoin="round" fill="none"
                  style={{ filter: 'blur(1px)', willChange: 'transform' }}
                  pathLength={expertiseProgress}
                  className="gpu-accelerated"
                />
              </svg>
            </div>

            {/* Scrolling Marquee */}
            <div className="relative pt-24 md:pt-32 overflow-hidden whitespace-nowrap flex z-10">
              <div className="font-sans flex items-center gap-12 md:gap-24 text-[7vw] font-bold text-white/80 uppercase leading-[1] tracking-[0.02em] shrink-0 animate-marquee">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="flex items-center gap-12 md:gap-24">
                    <span>Backend Developer &amp; ML Enthusiast</span>
                    <div className="relative w-[10vw] h-[10vw] flex-shrink-0">
                      <Image 
                        src="/images/green-flower.png" 
                        alt="flower" 
                        fill
                        sizes="10vw"
                        className="object-contain opacity-80" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content with kahfi-sitting image */}
            <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8 lg:px-12 pb-40 relative">
              {/* Me Sitting Image */}
              <div className="relative z-30 w-full mt-20 md:mt-32 mb-16 group">
                <div className="relative w-full overflow-hidden rounded-2xl" style={{ transform: 'scale(1.05)' }}>
                  <Image 
                    src="/images/kahfi-sitting.png" 
                    alt="Kahfi sitting" 
                    width={1500}
                    height={1000}
                    className="w-full h-auto object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-60" />
                </div>
              </div>

              {/* Driving Growth Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-start">
                <motion.h3
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-4xl font-sans font-medium text-white leading-tight tracking-tight"
                >
                  Driving real-world impact through solid backend engineering and machine learning solutions.
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-lg md:text-xl font-sans text-white/80 leading-tight"
                >
                  Every system I build starts with a deep understanding of the problem, turning complex requirements into clean, maintainable, and high-performance code. From API design to ML pipelines, I focus on outcomes that truly matter.
                </motion.p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 mt-12 md:mt-20 pt-8 md:pt-12 border-t border-white/10">
                <div className="flex flex-col gap-4 md:gap-8">
                  <h4 className="text-xs md:text-sm font-sans font-semibold text-white/50 uppercase tracking-widest">Years of Experience</h4>
                  <div className="text-5xl md:text-9xl font-sans font-medium text-white tracking-tighter">
                    <span className="tabular-nums flex items-baseline"><Counter target={2} /><span className="ml-1 text-[#2DD4BF]">+</span></span>
                  </div>
                </div>
                <div className="flex flex-col gap-4 md:gap-8 md:border-l md:border-white/10 md:pl-20">
                  <div className="w-full border-t border-white/10 md:hidden pt-8" />
                  <h4 className="text-xs md:text-sm font-sans font-semibold text-white/50 uppercase tracking-widest">Projects Completed</h4>
                  <div className="text-5xl md:text-9xl font-sans font-medium text-white tracking-tighter">
                    <span className="tabular-nums flex items-baseline"><Counter target={10} /><span className="ml-1 text-[#2DD4BF]">+</span></span>
                  </div>
                </div>
              </div>

              {/* Capabilities */}
              <div className="mt-24 md:mt-40">
                <h2 className="relative z-50 text-2xl md:text-4xl font-sans font-medium text-white leading-tight tracking-tight mb-12 md:mb-20 max-w-3xl">
                  Transforming ideas into exceptional digital experiences through expertise and innovation
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20 md:pb-40">
                  <CapabilityCard
                    number="01"
                    title="Backend Development"
                    description="Building scalable, high-performance server architectures using Node.js, Python, and REST APIs with clean system design principles and secure authentication."
                  />
                  <CapabilityCard
                    number="02"
                    title="Machine Learning"
                    description="Developing and deploying ML models for classification, prediction, and automation. Experienced in scikit-learn, TensorFlow, and building AI-driven pipelines."
                    className="relative z-30"
                  />
                  <CapabilityCard
                    number="03"
                    title="Digital Marketing"
                    description="Hands-on experience in digital marketing strategy and execution, gained through internship at Bee Happy Industri — driving brand presence and online engagement."
                    className="relative z-50"
                  />
                  <CapabilityCard
                    number="04"
                    title="Freelance Projects"
                    description="Delivering backend and machine learning solutions for clients on Freelancer.com — from API development to data-driven features tailored to business needs."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* ====== TECH STACK SECTION ====== */}
        <section className="relative z-40 bg-[#121212] py-24 md:py-32 px-4 md:px-8 lg:px-12">
          <div className="max-w-[1500px] mx-auto">
            <div className="mb-16 md:mb-24 flex flex-col items-start text-left">
              <motion.h2
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="text-3xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-[1.1] tracking-tight mb-2 md:mb-3"
              >
                Tech Stack
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
                className="text-lg md:text-xl font-sans text-white/50 max-w-2xl leading-relaxed"
              >
                A core set of modern technologies I use to build high-performance and scalable applications.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="mt-12"
            >
              <ThreeKeyboard />
            </motion.div>
          </div>
        </section>

        {/* ====== WORKS SECTION ====== */}
        <section className="relative z-40 bg-[#121212] py-24 md:py-32 px-4 md:px-8 lg:px-12">
          <div className="max-w-[1500px] mx-auto">
            <div className="mb-16 md:mb-24 flex flex-col items-start text-left">
              <motion.h2
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="text-3xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-[1.1] tracking-tight mb-2 md:mb-3"
              >
                Selected Works
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
                className="text-lg md:text-xl font-sans text-white/50 max-w-2xl leading-relaxed"
              >
                Discover my latest work and creative solutions that bring ideas to life
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 md:gap-y-24">
              {loading ? (
                <div className="col-span-full py-20 text-center text-white/30 font-sans">Loading projects...</div>
              ) : projects.length > 0 ? (
                projects.map((project) => (
                  <WorkCard 
                    key={project.id}
                    title={project.Title}
                    description={project.Description}
                    image={project.Img}
                    link={project.Link}
                    techStack={project.TechStack}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-white/30 font-sans">No projects found.</div>
              )}
            </div>

            {/* All Projects Button */}
            <div className="mt-24 md:mt-32 flex justify-center">
              <Magnetic>
                <div 
                  className="cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }} 
                >
                  <RollingButton href="/works" text="all projects" />
                </div>
              </Magnetic>
            </div>
          </div>
        </section>

        {/* ====== CERTIFICATES SECTION (Smart Hybrid Slider) ====== */}
        <section ref={certSectionRef} style={{ height: `calc(100vh + ${maxTranslateScroll}px)` }} className="relative bg-[#121212] border-t border-white/5">
          <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
            <div className="max-w-[1500px] mx-auto w-full px-4 md:px-8 lg:px-12 mb-12">
              <div className="flex flex-col items-start text-left">
                <motion.h2
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                  className="text-3xl md:text-4xl font-sans font-medium text-white leading-tight tracking-tight mb-2 md:mb-3 max-w-3xl"
                >
                  A testament to my continuous learning and professional achievements
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
                  className="text-lg md:text-xl font-sans text-white/50 max-w-2xl leading-relaxed"
                >
                  My accomplishments are a reflection of a commitment to technical excellence and a relentless pursuit of knowledge in the ever-evolving digital landscape.
                </motion.p>
              </div>
            </div>

            <motion.div 
              style={{ x: finalCertX }}
              className="flex gap-8 px-[10vw]"
            >
              {loadingCerts ? (
                <div className="min-w-screen py-20 text-center text-white/30 font-sans">Loading certificates...</div>
              ) : certificates.length > 0 ? (
                certificates.map((cert) => (
                  <CertificateCard 
                    key={cert.id}
                    image={cert.img}
                    onView={() => setSelectedCert(cert.img)}
                  />
                ))
              ) : (
                <div className="min-w-screen py-20 text-center text-white/30 font-sans">No certificates found.</div>
              )}
            </motion.div>

            {/* Manual Navigation Buttons */}
            <div className="absolute inset-x-0 top-[60%] -translate-y-1/2 flex justify-between px-4 md:px-12 pointer-events-none z-50">
              <button 
                onClick={() => {
                  const currentManual = manualXOffset.get();
                  const currentBase = certBaseX.get();
                  if (currentBase + currentManual < 0) {
                    animate(manualXOffset, currentManual + 482, { type: "spring", stiffness: 300, damping: 30 });
                  }
                }}
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#2DD4BF] hover:text-black hover:border-[#2DD4BF] transition-all duration-300 backdrop-blur-md pointer-events-auto shadow-2xl"
                aria-label="Previous Certificate"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => {
                  const currentManual = manualXOffset.get();
                  const currentBase = certBaseX.get();
                  const nextVisual = currentBase + currentManual - 482;

                  if (nextVisual <= -maxTranslateAll) {
                    const section = certSectionRef.current;
                    if (section) {
                      const scrollTarget = section.offsetTop + section.offsetHeight - window.innerHeight;
                      window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
                    }
                  }

                  if (currentBase + currentManual > -maxTranslateAll) {
                    animate(manualXOffset, currentManual - 482, { type: "spring", stiffness: 300, damping: 30 });
                  }
                }}
                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-[#2DD4BF] hover:text-black hover:border-[#2DD4BF] transition-all duration-300 backdrop-blur-md pointer-events-auto shadow-2xl"
                aria-label="Next Certificate"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </section>

        {/* ====== WORK EXPERIENCE SECTION (Table Style) ====== */}
        <section className="relative z-40 bg-[#121212] py-24 md:py-32 px-4 md:px-8 lg:px-12 border-t border-white/5">
          <div className="max-w-[1500px] mx-auto">
            <div className="mb-16 md:mb-24 flex flex-col items-start text-left">
              <motion.h2
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="text-3xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-[1.1] tracking-tight mb-2 md:mb-3"
              >
                Work Experience
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
                className="text-lg md:text-xl font-sans text-white/50 max-w-2xl leading-relaxed"
              >
                Practical applications of my skills through professional internships and freelance projects.
              </motion.p>
            </div>

            {/* Premium Experience Table */}
            <div className="w-full">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-6 border-b border-white/10 text-xs font-sans font-semibold uppercase tracking-[0.2em] text-white/30">
                <div className="col-span-5">Position</div>
                <div className="col-span-4">Company</div>
                <div className="col-span-3">Period</div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col">
                {[
                  {
                    role: "Backend & Machine Learning Developer",
                    company: "Freelancer.com",
                    period: "2024 – Present",
                    desc: "Developing scalable server architectures and machine learning solutions for various industries."
                  },
                  {
                    role: "Digital Marketing Intern",
                    company: "Bee Happy Corp",
                    period: "2023 – 2024",
                    desc: "Driving brand grow through data-driven marketing strategies and social media analytics."
                  }
                ].map((exp, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group border-b border-white/5 py-10 md:py-16 hover:bg-white/[0.02] transition-all duration-500"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 items-start relative">
                      <div className="col-span-1 md:col-span-5">
                        <h3 className="text-xl md:text-3xl font-sans font-medium text-white group-hover:text-[#2DD4BF] transition-colors duration-300">
                          {exp.role}
                        </h3>
                        <p className="mt-4 text-white/50 font-sans text-base md:text-lg max-w-xl leading-relaxed">
                          {exp.desc}
                        </p>
                      </div>
                      <div className="col-span-1 md:col-span-4 flex items-center md:items-start h-full">
                        <span className="text-lg md:text-2xl font-sans text-white/70">
                          {exp.company}
                        </span>
                      </div>
                      <div className="col-span-1 md:col-span-3 flex items-center">
                        <span className="text-base md:text-xl font-sans font-medium text-white/30 tabular-nums">
                          {exp.period}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ====== EXPERIENCE SECTION ====== */}
        <section ref={experienceSecRef} className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden bg-[#0A0A0A]">
          <div className="container mx-auto px-6 mb-48 text-center relative z-30">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl lg:text-6xl font-sans font-bold max-w-4xl mx-auto leading-[1.1] tracking-tight text-white"
            >
              Discover my academic path and the foundation of my professional journey.
            </motion.h2>
          </div>

          {/* Vertical Timeline Line */}
          <div className="absolute left-6 md:left-1/2 top-[450px] bottom-[calc(15vh+180px)] w-[1px] bg-white/5 z-10">
            <motion.div
              className="absolute top-0 left-0 w-[4px] -ml-[1.5px] h-full bg-[#2DD4BF] shadow-[0_0_25px_rgba(45,212,191,0.5)] origin-top z-20"
              style={{ scaleY: springExpProgress }}
            />
          </div>

          {/* Green Snake SVG Line */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="w-full h-full"
            >
              <svg viewBox="0 0 1000 2200" className="w-full h-full overflow-visible" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <motion.path
                  d="M 500 0 C 500 200, 850 400, 850 600 C 850 1000, 150 1200, 150 1600 C 150 1900, -200 2000, -500 2200"
                  stroke="#2DD4BF"
                  strokeWidth="30"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{ willChange: 'transform' }}
                  pathLength={springExpProgress}
                  className="gpu-accelerated"
                />
              </svg>
            </motion.div>
          </div>

          <div className="relative z-20">
            <ExperienceItem
              title="Universitas Brawijaya"
              role="Information Technology"
              description="Currently pursuing an undergraduate degree in Information Technology. Focused on system development, algorithms, and modern software architecture to build future-ready solutions."
              period="2025 – Present"
              align="right"
              logo="/images/ub.png"
            />
            <ExperienceItem
              title="SMK Negeri 3 Malang"
              role="Teknik Komputer Jaringan (TKJ)"
              description="Built a strong foundation in computer networking, operating systems, and IT infrastructure. Actively developed programming skills and focused on backend system development throughout high school."
              period="2021 – 2024"
              align="left"
              logo="/images/smk3.png"
            />
          </div>
        </section>

        <Footer />
      </main>

      {/* Lightbox Modal */}
      {selectedCert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedCert(null)}
          className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-10 cursor-pointer backdrop-blur-lg"
        >
          <button 
            onClick={() => setSelectedCert(null)}
            className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10"
          >
            <X size={24} />
          </button>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-full max-h-full overflow-hidden rounded-lg shadow-2xl"
          >
              <img 
                src={selectedCert} 
                alt="Full Certificate" 
                loading="lazy"
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

/* ---------- SUBCOMPONENTS ---------- */

function RollingButton({ href, text }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-[2px] group cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={href}
        className="relative bg-white/5 text-white border border-white/10 text-lg px-8 py-4 rounded-full font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(45,212,191,0.3)]"
      >
        {/* Sweep fill */}
        <motion.div
          className="absolute inset-0 bg-[#2DD4BF] z-0"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "0%" : "-100%" }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        />
        <div className="relative z-10 h-7 overflow-hidden flex flex-col items-center">
          <div className="flex">
            {text.split("").map((char, i) => (
                <motion.span
                  key={`top-${i}`}
                  className="inline-block"
                  animate={{ 
                    y: isHovered ? -28 : 0,
                    color: isHovered ? "#000" : "#fff" 
                  }}
                  transition={{ duration: 0.3, delay: i * 0.01, ease: [0.76, 0, 0.24, 1] }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>
            <div className="flex absolute top-8">
              {text.split("").map((char, i) => (
                <motion.span
                  key={`bot-${i}`}
                  className="inline-block"
                  animate={{ 
                    y: isHovered ? -32 : 0,
                    color: isHovered ? "#000" : "#fff" 
                  }}
                  transition={{ duration: 0.3, delay: i * 0.01, ease: [0.76, 0, 0.24, 1] }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>
          </div>
        </Link>
      <div className="relative bg-white/5 border border-white/10 p-4 rounded-full text-white overflow-hidden flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_25px_rgba(45,212,191,0.3)]">
        <motion.div
          className="absolute inset-0 bg-[#2DD4BF] z-0"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "0%" : "-100%" }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        />
        <div className="relative z-10 flex items-center justify-center">
          <motion.div
            animate={{ 
              color: isHovered ? "#000" : "#fff",
              x: isHovered ? 6 : 0,
              rotate: isHovered ? 45 : 0
            }}
            transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
          >
            <ArrowUpRight size={24} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CertificateCard({ image, onView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={onView}
      className="group relative flex-none w-[300px] md:w-[450px] aspect-[4/3] overflow-hidden rounded-xl bg-white/5 border border-white/10 cursor-pointer snap-center"
    >
      <img 
        src={image} 
        alt="Certificate" 
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
            <ArrowUpRight size={24} className="text-white" />
          </div>
          <span className="text-white text-sm font-sans font-medium uppercase tracking-wider">View Full</span>
        </div>
      </div>
    </motion.div>
  );
}

function CapabilityCard({ number, title, description, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`bg-white/5 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-8 md:p-12 flex flex-col gap-10 group hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(45,212,191,0.2)] hover:border-white/20 transition-all duration-300 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="w-14 h-14 rounded-full bg-[#2DD4BF]/20 border border-[#2DD4BF]/30 flex items-center justify-center">
          <ArrowUpRight size={20} className="text-[#2DD4BF]" />
        </div>
        <span className="text-xs font-sans font-semibold text-white/20">{number}</span>
      </div>
      <div className="flex flex-col gap-5 mt-6">
        <h3 className="text-2xl md:text-3xl font-sans font-medium text-white leading-tight">{title}</h3>
        <div className="w-full h-px bg-white/[0.15]" />
        <p className="text-base md:text-lg font-sans text-white/70 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

function WorkCard({ title, description, image, link, techStack }) {
  // Helper to map common tech names to skillicons identifiers
  const getTechIcons = (stack) => {
    if (!Array.isArray(stack)) return "";
    const mapping = {
      'javascript': 'js',
      'php': 'php',
      'html': 'html',
      'css': 'css',
      'python': 'py',
      'mysql': 'mysql',
      'react': 'react',
      'node': 'nodejs',
      'next': 'nextjs',
      'tailwind': 'tailwind',
      'typescript': 'ts',
      'mongodb': 'mongodb'
    };
    return stack.map(s => {
      const lower = s.toLowerCase();
      return mapping[lower] || lower;
    }).join(",");
  };

  const iconsQuery = getTechIcons(techStack);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-4"
    >
      <Link 
        href={link || "#"} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="flex flex-col gap-4">
          <span className="text-sm font-sans font-semibold text-white/30 uppercase tracking-[0.2em] px-1">
            {title}
          </span>
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg cursor-pointer">
            <div className="w-full h-full">
              <img 
                alt={title} 
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                src={image} 
              />
            </div>
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-8 z-10 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl md:text-3xl font-sans font-bold text-white drop-shadow-lg">{title}</h3>
                  <div className="w-12 h-0.5 bg-[#2DD4BF] mx-auto opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100" />
                </div>
                <p className="text-sm md:text-base text-white/80 max-w-sm opacity-0 group-hover:opacity-100 transition-opacity delay-200 duration-500 line-clamp-3">
                  {description}
                </p>
                {iconsQuery && (
                  <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-300 duration-500">
                    <img 
                      src={`https://skillicons.dev/icons?i=${iconsQuery}&theme=dark`} 
                      alt="Tech Stack" 
                      loading="lazy"
                      className="h-8 md:h-10 w-auto object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="absolute top-8 right-8 w-10 h-10 border border-white/30 rounded-full flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/20">
              <ArrowUpRight size={20} className="text-[#2DD4BF]" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ExperienceItem({ title, role, description, period, align, logo }) {
  return (
    <div className="relative w-full min-h-[40vh] md:min-h-[60vh] flex items-center justify-start md:justify-center py-10 md:py-20">
      <div className="w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
        <div className={`${align === 'right' ? 'md:col-start-1 md:text-right md:pr-24' : 'md:col-start-2 md:text-left md:pl-24'} pl-14 pr-6 text-left`}>
          {logo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`mb-4 flex ${align === 'right' ? 'md:justify-end' : 'md:justify-start'} justify-start`}
            >
              <img src={logo} alt={title + ' logo'} loading="lazy" className="h-24 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
            </motion.div>
          )}
          <motion.div
            initial={{ y: 100 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden mb-2"
          >
            <h3 className="text-3xl md:text-7xl font-sans font-bold text-white">{title}</h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="overflow-hidden mb-4 md:mb-6"
          >
            <p className="text-lg md:text-3xl font-sans font-normal text-white/60">{role}</p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`text-sm md:text-lg font-sans font-normal text-white/50 leading-tight ${align === 'right' ? 'md:text-right' : 'md:text-left'} text-left max-w-xl ${align === 'right' ? 'md:ml-auto md:mr-0' : 'md:mr-auto md:ml-0'}`}
          >
            {description}
          </motion.p>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="block mt-4 text-base md:text-lg font-sans font-normal uppercase text-white/30"
          >
            {period}
          </motion.span>
        </div>
      </div>
      {/* Timeline dot */}
      <div className="absolute left-6 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="w-3 h-3 rounded-full border border-white/10 transition-all duration-500" />
      </div>
    </div>
  );
}
