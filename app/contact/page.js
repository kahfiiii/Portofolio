"use client";

import { motion } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen">
      <Header />
      
      <main className="pt-32 pb-20 px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto">
        {/* Header */}
        <section className="mb-32">
           <div className="overflow-hidden mb-8">
              <motion.h1 
                 initial={{ y: "100%" }}
                 animate={{ y: 0 }}
                 transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                 className="text-5xl md:text-8xl lg:text-[10rem] font-display font-medium leading-[0.85] tracking-tighter"
              >
                 Let&apos;s <br /> <span className="text-white/20">Talk.</span>
              </motion.h1>
           </div>
           <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/50 max-w-2xl leading-relaxed"
           >
              Whether you have a project in mind or just want to say hi, feel free to reach out. I&apos;m always open to discussing new opportunities.
           </motion.p>
        </section>

        {/* Contact Info & Socials */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_0.6fr] gap-20 mb-60">
           <div className="space-y-16">
              <div className="space-y-6">
                 <h2 className="text-sm uppercase tracking-[0.3em] text-white/40 font-bold">Contact Details</h2>
                 <div className="space-y-8">
                    <a href="mailto:mkafi9393@gmail.com" className="text-2xl md:text-6xl font-display font-medium hover:text-[#2DD4BF] transition-colors block underline decoration-white/5 underline-offset-8">
                       mkafi9393@gmail.com
                    </a>
                    <a href="https://wa.me/6285859341752" className="text-2xl md:text-6xl font-display font-medium hover:text-[#2DD4BF] transition-colors block underline decoration-white/5 underline-offset-8">
                       +62 858 5934 1752
                    </a>
                 </div>
              </div>

              <div className="space-y-6">
                 <h2 className="text-sm uppercase tracking-[0.3em] text-white/40 font-bold">Socials</h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SocialGridItem href="https://www.linkedin.com/in/mohamadsohibulkahfi/" icon={<Linkedin size={24} />} label="LinkedIn" />
                    <SocialGridItem href="https://github.com/kahfiiii" icon={<Github size={24} />} label="Github" />
                    <SocialGridItem href="mailto:mkafi9393@gmail.com" icon={<Mail size={24} />} label="Email" />
                    <SocialGridItem 
                      href="https://wa.me/6285859341752" 
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      } 
                      label="WhatsApp" 
                    />
                 </div>
              </div>
           </div>

           <div className="relative group">
              <div className="bg-white/5 p-12 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl space-y-8 shadow-[0_0_50px_rgba(45,212,191,0.05)]">
                 <h3 className="text-3xl md:text-4xl font-display font-medium text-white">Available for work</h3>
                 <p className="text-white/50 leading-relaxed text-lg">
                    I&apos;m currently accepting new projects and freelance opportunities. My typical response time is within 24 hours.
                 </p>
                 <div className="w-full h-px bg-white/10" />
                 <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#2DD4BF] animate-pulse shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
                    <span className="text-xs font-bold uppercase tracking-widest text-[#2DD4BF]">Open for new projects</span>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function SocialGridItem({ href, icon, label }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-[#2DD4BF]/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] transition-all duration-500 flex items-center gap-6 group"
    >
       <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-[#2DD4BF] group-hover:text-black transition-all duration-500">
          {icon}
       </div>
       <span className="text-xl font-medium text-white/70 group-hover:text-white transition-colors">{label}</span>
    </a>
  );
}
