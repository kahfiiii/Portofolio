"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";

import { Menu, X as CloseIcon } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Works", href: "/works" },
  { name: "About", href: "/about-me" },
];

function RollingTextLink({ text, href, theme, className = "" }) {
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === "dark";

  return (
    <Link
      href={href}
      className={`relative group overflow-hidden transition-colors duration-500 ${
        isDark ? "text-white" : "text-black/80"
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex flex-col items-center overflow-hidden h-6 md:h-8">
        <div className="flex">
          {text.split("").map((char, i) => (
            <motion.span
              key={`top-${i}`}
              className="inline-block"
              animate={{ y: isHovered ? -32 : 0 }}
              transition={{
                duration: 0.3,
                delay: i * 0.01,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
        <div className="flex absolute top-6 md:top-8">
          {text.split("").map((char, i) => (
            <motion.span
              key={`bot-${i}`}
              className={`inline-block ${isDark ? "text-[#2DD4BF]" : "text-black"}`}
              animate={{ y: isHovered ? -32 : 0 }}
              transition={{
                duration: 0.3,
                delay: i * 0.01,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
      </div>
    </Link>
  );
}

function MobileMenuOverlay({ isOpen, onClose, navLinks }) {
  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      }
    },
    opened: {
      x: "0%",
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      }
    }
  };

  return (
    <motion.div
      initial="closed"
      animate={isOpen ? "opened" : "closed"}
      variants={menuVariants}
      className="fixed inset-0 bg-[#0A0A0A] z-[100] flex flex-col justify-center px-10 pointer-events-auto"
    >
      <div className="flex flex-col gap-8">
        <span className="text-white/20 text-xs font-sans uppercase tracking-[0.3em] mb-4">Navigation</span>
        {navLinks.map((link, i) => (
          <motion.div
            key={link.name}
            initial={{ opacity: 0, x: 50 }}
            animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
          >
            <Link 
              href={link.href} 
              onClick={onClose}
              className="text-5xl font-display font-medium text-white hover:text-[#2DD4BF] transition-colors flex items-center group"
            >
              {link.name}
              <ArrowUpRight className="ml-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" size={40} />
            </Link>
          </motion.div>
        ))}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.6 }}
          className="mt-20 pt-10 border-t border-white/5 flex flex-col gap-6"
        >
          <span className="text-white/20 text-xs font-sans uppercase tracking-[0.3em]">Contact</span>
          <Link href="/contact" onClick={onClose} className="text-2xl text-white font-sans">mkafi9393@gmail.com</Link>
          <div className="flex gap-8 mt-4">
            <a href="https://www.linkedin.com/in/mohamadsohibulkahfi/" className="text-white/50 hover:text-[#2DD4BF]">LinkedIn</a>
            <a href="https://github.com/kahfiiii" className="text-white/50 hover:text-[#2DD4BF]">GitHub</a>
          </div>
        </motion.div>
      </div>

      {/* Close Button Inside */}
      <button 
        onClick={onClose}
        className="absolute top-10 right-10 p-4 rounded-full bg-white/5 border border-white/10 text-white"
      >
        <CloseIcon size={24} />
      </button>
    </motion.div>
  );
}

function RollingContactButton({ theme }) {
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === "dark";

  return (
    <div
      className="flex items-center gap-[1px] group cursor-pointer relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href="/contact"
        className={`relative px-7 py-3 rounded-full overflow-hidden transition-all duration-500 font-sans pointer-events-auto flex items-center justify-center ${
          isDark 
            ? "bg-white/5 text-white border border-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(45,212,191,0.4)]" 
            : "bg-[#1E1E1E] text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]"
        }`}
      >
        {/* Fill sweep */}
        <motion.div
          className={`absolute inset-0 z-0 ${isDark ? "bg-[#2DD4BF]" : "bg-black"}`}
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "0%" : "-100%" }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        />
        <div className="relative z-10 h-6 overflow-hidden flex flex-col items-center">
          <div className="flex font-medium">
            {"Contact".split("").map((char, i) => (
              <motion.span
                key={`top-${i}`}
                className="inline-block"
                animate={{
                  y: isHovered ? -24 : 0,
                  color: isHovered ? "#000" : (isDark ? "#fff" : "#fff"),
                }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.01,
                  ease: [0.76, 0, 0.24, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
          <div className="flex absolute top-8 font-medium">
            {"Contact".split("").map((char, i) => (
              <motion.span
                key={`bot-${i}`}
                className="inline-block"
                animate={{
                  y: isHovered ? -32 : 0,
                  color: isHovered ? "#000" : (isDark ? "#000" : "#fff"),
                }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.01,
                  ease: [0.76, 0, 0.24, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>
        </div>
      </Link>
      <div className={`relative p-3 rounded-full overflow-hidden transition-all duration-500 flex items-center justify-center ${
        isDark ? "bg-white/5 text-white border border-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(45,212,191,0.4)]" : "bg-[#1E1E1E] text-white hover:shadow-[0_0_20px_rgba(0,0,0,0.3)]"
      }`}>
        <motion.div
          className={`absolute inset-0 z-0 ${isDark ? "bg-[#2DD4BF]" : "bg-black"}`}
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "0%" : "-100%" }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        />
        <div className="relative z-10 flex items-center justify-center">
          <motion.div
            animate={{ color: isHovered ? "#000" : (isDark ? "#fff" : "#fff") }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <ArrowUpRight size={18} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const theme = "dark";
  const [logoHovered, setLogoHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-5 left-0 w-full z-50 px-5 py-4 md:py-6 lg:px-12 flex items-center justify-between pointer-events-none transition-colors duration-500">
        {/* Logo */}
        <Link 
          href="/" 
          className="z-[110] shrink-0 ml-[-10px] pointer-events-auto"
          onMouseEnter={() => setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform duration-500 hover:scale-110">
            <Image
              alt="Logo"
              width={50}
              height={50}
              priority
              style={{
                filter: logoHovered 
                  ? "invert(72%) sepia(85%) saturate(369%) hue-rotate(124deg) brightness(93%) contrast(89%)" 
                  : (isMenuOpen ? "invert(100%)" : "invert(100%) brightness(200%)")
              }}
              className="w-full h-full object-contain scale-[1.3] origin-left transition-all duration-500"
              src="/images/logo.png"
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10 pointer-events-auto">
          <div className="flex items-center gap-8 font-normal text-[15px]">
            {navLinks.map((link) => (
              <RollingTextLink key={link.name} text={link.name} href={link.href} theme={theme} />
            ))}
          </div>
          <RollingContactButton theme={theme} />
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center gap-4 pointer-events-auto z-[110]">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full text-white font-sans text-sm font-medium"
          >
            {isMenuOpen ? "Close" : "Menu"}
            {isMenuOpen ? <CloseIcon size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        navLinks={navLinks} 
      />
    </>
  );
}
