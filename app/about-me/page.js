"use client";

import { motion } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ArrowUpRight, Code2, Cpu, Globe, Layout } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen relative">
      <Header />
      
      <main className="pt-32 pb-20 px-6 sm:px-10 lg:px-20 max-w-7xl mx-auto">
        {/* Title Section */}
        <section className="mb-32">
          <div className="overflow-hidden mb-8">
             <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-8xl lg:text-[10rem] font-display font-medium leading-[0.85] tracking-tighter"
             >
                The Story <br /> <span className="text-white/20">Behind.</span>
             </motion.h1>
          </div>
          
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="text-xl md:text-2xl text-white/50 max-w-3xl leading-relaxed"
          >
             I&apos;m a Backend Developer & Machine Learning Enthusiast who enjoys building robust server-side systems and intelligent data-driven solutions. My work sits at the intersection of clean engineering, scalable architecture, and practical AI applications.
          </motion.p>
        </section>

        {/* Narrative Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-60">
          <div className="order-2 lg:order-1 relative group">
             <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 shadow-2xl">
                <Image 
                   src="/images/me.jpeg" 
                   alt="Mohamad Sohibul Kahfi" 
                   fill
                   sizes="(max-width: 768px) 100vw, 40vw"
                   className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
             </div>
          </div>
          
          <div className="order-1 lg:order-2 space-y-20 pt-10">
             <div className="space-y-8">
                <h2 className="text-4xl font-display font-medium tracking-tighter">My Story.</h2>
                <div className="space-y-6 text-lg md:text-xl text-white/60 leading-relaxed font-sans">
                    <p>
                       Perjalanan saya dimulai di SMK Negeri 3 Malang jurusan Teknik Komputer Jaringan, di mana saya membangun fondasi kuat di bidang infrastruktur IT, jaringan, dan pemrograman dasar.
                    </p>
                    <p>
                       Dari sana, saya berkembang ke backend development dan machine learning — mengerjakan proyek freelance di Freelancer.com, serta mendapat pengalaman digital marketing di Bee Happy Industri. Saya percaya bahwa sistem yang baik dibangun di atas logika yang bersih dan arsitektur yang dapat diandalkan.
                    </p>
                </div>
             </div>

             <div className="space-y-10">
                <h2 className="text-4xl font-display font-medium tracking-tighter">What I Do.</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SkillCard icon={<Globe size={20} />} title="Backend" items={["Node.js / Express", "Python / Flask", "REST API", "PostgreSQL"]} />
                    <SkillCard icon={<Cpu size={20} />} title="Machine Learning" items={["scikit-learn", "TensorFlow", "Pandas", "Data Pipelines"]} />
                    <SkillCard icon={<Code2 size={20} />} title="Tools & Infra" items={["Git / GitHub", "Docker", "Linux", "VS Code"]} />
                    <SkillCard icon={<Layout size={20} />} title="Marketing" items={["Digital Marketing", "Content Strategy", "Social Media", "Analytics"]} />
                </div>
             </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-40">
          <div className="flex justify-between items-end mb-24">
             <h2 className="text-5xl md:text-7xl font-display font-medium tracking-tighter font-sans">Experience.</h2>
             <span className="text-white/20 font-bold uppercase tracking-widest text-sm mb-4">2023 — Present</span>
          </div>
          <div className="space-y-px border-t border-white/10">
              <ExperienceItem 
                 role="Teknik Komputer Jaringan (TKJ)" 
                 company="SMK Negeri 3 Malang" 
                 period="2021 - 2024" 
                 description="Membangun fondasi di bidang jaringan komputer, sistem operasi, dan infrastruktur IT. Aktif mengembangkan keterampilan backend selama masa sekolah."
              />
              <ExperienceItem 
                 role="Digital Marketing" 
                 company="Bee Happy Industri" 
                 period="2023 - 2024" 
                 description="Menjalankan strategi pemasaran digital, mengelola konten, kampanye iklan, dan analitik media sosial untuk mendukung pertumbuhan bisnis."
              />
               <ExperienceItem 
                 role="Backend & Machine Learning Developer" 
                 company="Freelancer.com" 
                 period="2024 - Present" 
                 description="Mengerjakan proyek freelance backend dan ML — dari desain REST API hingga membangun model klasifikasi untuk kebutuhan klien internasional."
              />
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="mt-40 mb-20 border-t border-white/5 pt-40">
           <div className="space-y-6">
              <span className="text-[#2DD4BF] font-sans font-bold uppercase tracking-widest text-sm">Let&apos;s Connect</span>
              <div className="space-y-4">
                 <a href="mailto:mkafi9393@gmail.com" className="text-3xl md:text-8xl font-display font-medium hover:text-[#2DD4BF] transition-all duration-500 block underline decoration-white/5 underline-offset-8">
                    mkafi9393@gmail.com
                 </a>
                 <a href="https://wa.me/6285859341752" className="text-3xl md:text-8xl font-display font-medium hover:text-[#2DD4BF] transition-all duration-500 block underline decoration-white/5 underline-offset-8">
                    +62 858 5934 1752
                 </a>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function SkillCard({ icon, title, items }) {
  return (
    <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#2DD4BF]/30 transition-all duration-500 group">
       <div className="mb-6 p-4 rounded-xl bg-white/10 w-fit group-hover:bg-[#2DD4BF] group-hover:text-black transition-all">
          {icon}
       </div>
       <h3 className="text-white font-display text-xl font-medium mb-4">{title}</h3>
       <ul className="space-y-2">
          {items.map((item) => (
             <li key={item} className="text-white/40 font-medium text-sm group-hover:text-white/70 transition-colors uppercase tracking-wider">{item}</li>
          ))}
       </ul>
    </div>
  );
}

function ExperienceItem({ role, company, period, description }) {
  return (
    <div className="group border-b border-white/10 hover:bg-white/[0.02] transition-colors py-16 px-6 sm:px-10 flex flex-col md:flex-row justify-between gap-10 items-start">
       <div className="space-y-4 max-w-2xl">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/40 text-xs font-bold tracking-widest uppercase">
             {period}
          </span>
          <h3 className="text-3xl md:text-4xl font-display font-medium tracking-tighter text-white group-hover:text-[#2DD4BF] transition-colors duration-300">{company}</h3>
          <p className="text-white/80 text-xl">{role}</p>
          <p className="text-white/40 text-lg leading-relaxed pt-2">{description}</p>
       </div>
       <div className="p-5 rounded-full border border-white/10 group-hover:bg-[#2DD4BF] group-hover:border-[#2DD4BF] group-hover:text-black transition-all duration-500">
          <ArrowUpRight size={28} />
       </div>
    </div>
  );
}
