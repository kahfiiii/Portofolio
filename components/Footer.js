"use client";

import { motion } from "framer-motion";
import { useState } from "react";

function RollingTextLink({ text, href }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className="relative group overflow-hidden transition-colors duration-500 text-white/70 hover:text-[#2DD4BF]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex flex-col overflow-hidden h-6">
        <motion.div
          animate={{ y: isHovered ? -24 : 0 }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          className="flex flex-col"
        >
          <span className="flex items-center h-6 text-sm md:text-base font-sans">{text}</span>
          <span className="flex items-center h-6 text-sm md:text-base font-sans text-[#2DD4BF] font-medium">{text}</span>
        </motion.div>
      </div>
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-[#0A0A0A] min-h-screen pt-25 pb-0 overflow-hidden border-t border-white/5">
      {/* Curved top edge transition */}
      <div className="absolute top-0 left-0 w-full overflow-visible pointer-events-none z-40 transform -translate-y-[99%]">
        <svg
          viewBox="0 0 1440 150"
          className="w-full h-auto block fill-[#0A0A0A]"
          preserveAspectRatio="none"
        >
          <motion.path
            initial={{ d: "M 0 150 Q 720 150 1440 150 L 1440 150 L 0 150 Z" }}
            whileInView={{
              d: "M 0 150 Q 720 0 1440 150 L 1440 150 L 0 150 Z",
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          />
        </svg>
      </div>

      <div className="w-full px-6 md:px-8 lg:px-10 relative z-10 flex flex-col min-h-[calc(90vh-90px)]">
        {/* Top Section: Links + Contact */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-12">
          <div className="w-full lg:w-auto">
            <div className="flex flex-wrap items-start gap-x-5 md:gap-x-8 lg:gap-x-12 gap-y-5">
              {/* Links Column */}
              <div className="flex flex-col gap-2 min-w-[100px]">
                <span className="text-white/20 text-xs md:text-sm font-sans uppercase tracking-[0.2em] mb-3">Navigation</span>
                <RollingTextLink text="Home" href="/" />
                <RollingTextLink text="Works" href="/works" />
                <RollingTextLink text="About" href="/about-me" />
                <RollingTextLink text="Contact" href="/contact" />
              </div>

              {/* Socials Column */}
              <div className="flex flex-col gap-2 min-w-[100px]">
                <span className="text-white/20 text-xs md:text-sm font-sans uppercase tracking-[0.2em] mb-3">Socials</span>
                <RollingTextLink text="Email" href="mailto:mkafi9393@gmail.com" />
                <RollingTextLink text="Linkedin" href="https://www.linkedin.com/in/mohamadsohibulkahfi/" />
                <RollingTextLink text="Whatsapp" href="https://wa.me/6285859341752" />
                <RollingTextLink text="Github" href="https://github.com/kahfiiii" />
              </div>

              {/* Version Column */}
              <div className="hidden md:flex flex-col gap-2">
                <span className="text-white/20 text-xs md:text-sm font-sans uppercase tracking-[0.2em] mb-3">Version</span>
                <span className="text-white/70 text-sm md:text-base font-sans">{new Date().getFullYear()} © Edition</span>
              </div>
            </div>

            {/* Mobile Version */}
            <div className="md:hidden flex flex-col gap-4 mt-12 mb-10">
              <span className="text-white/20 text-[10px] font-sans uppercase tracking-[0.2em] mb-2">Version</span>
              <span className="text-white/70 text-lg font-sans">{new Date().getFullYear()} © Edition</span>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto mt-10 lg:mt-0">
            <FooterContactButton href="tel:+6285859341752" text="+6285859341752" />
            <FooterContactButton href="mailto:mkafi9393@gmail.com" text="mkafi9393@gmail.com" />
          </div>
        </div>

        {/* Large KAHFI Text with Spline behind it */}
        <div className="hidden lg:flex flex-grow relative flex-col items-center justify-end">
          {/* Spline 3D background */}
          <div className="absolute inset-0 z-20 pointer-events-auto opacity-100 flex items-center justify-center">
            <iframe
               src="https://my.spline.design/robot-W203an0eIHuIZsfNuG4HwpW4/"
               frameBorder="0"
               width="100%"
               height="100%"
               style={{ background: 'transparent' }}
               title="Robot Spline 3D"
            ></iframe>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full text-center pointer-events-none select-none relative z-10"
          >
            <h1 className="text-[25vw] font-bold text-white leading-[0.8] tracking-tighter">KAHFI</h1>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

function FooterContactButton({ href, text }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      className="relative block px-8 py-4 rounded-full border border-white/10 overflow-hidden transition-colors duration-500 bg-transparent group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sweep fill */}
      <motion.div
        className="absolute inset-0 bg-[#2DD4BF] z-0"
        initial={{ y: "100%" }}
        animate={{ y: isHovered ? "0%" : "100%" }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      />
      <div className="relative z-10 h-5 overflow-hidden flex flex-col items-center">
        <motion.div
          className="flex flex-col items-center"
          animate={{ y: isHovered ? -20 : 0 }}
          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
        >
          <span className="text-white text-sm font-sans flex items-center h-5">{text}</span>
          <span className="text-black text-sm font-sans flex items-center h-5 font-medium">{text}</span>
        </motion.div>
      </div>
    </a>
  );
}
