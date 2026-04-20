"use client";

import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { ArrowUpRight, X } from "lucide-react";
import Image from "next/image";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function WorksPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('id', { ascending: false });
        
        if (error) throw error;
        if (data) setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen relative">
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
                 Selected <br /> <span className="text-white/20">Work.</span>
              </motion.h1>
           </div>
           <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/50 max-w-2xl leading-relaxed"
           >
              Discover my latest works where design, technology, and creativity come together to craft engaging digital experiences.
           </motion.p>
        </section>

        {/* Project Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32">
           {loading ? (
              <div className="col-span-full py-20 text-center text-white/30 font-sans">Loading projects...</div>
           ) : projects.length > 0 ? (
              projects.map((project, index) => (
                 <ProjectCard 
                    key={project.id || index} 
                    project={project} 
                    index={index} 
                    onClick={() => setSelectedProject(project)}
                 />
              ))
           ) : (
              <div className="col-span-full py-20 text-center text-white/30 font-sans">No projects found.</div>
           )}
        </section>

        {/* Call to Action */}
        <section className="mt-60 text-center border-t border-white/10 pt-32">
           <h2 className="text-4xl md:text-6xl font-display font-medium mb-12 tracking-tighter">Have a project in mind?</h2>
           <motion.a 
              href="/contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-6 bg-[#2DD4BF] text-black px-12 py-6 rounded-full text-xl font-bold hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] transition-all duration-300 group"
           >
              Start a Conversation 
              <ArrowUpRight size={28} className="group-hover:rotate-45 transition-transform duration-500" />
           </motion.a>
        </section>
      </main>

      <Footer />

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectCard({ project, index, onClick }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index % 2 * 0.1 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
        <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden mb-8 bg-white/5 border border-white/10">
          <Image 
             src={project.Img || project.image} 
             alt={project.Title || project.title} 
             fill
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
             className="object-cover transition-transform duration-[1.5s] group-hover:scale-105 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
             <div className="bg-[#2DD4BF] text-black p-6 rounded-full scale-50 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                <ArrowUpRight size={32} />
             </div>
          </div>
       </div>
       
       <div className="flex flex-col gap-3 px-4">
          <div className="flex justify-between items-start">
             <div className="space-y-2">
                <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold">
                   {project.Category || project.category || "Development"}
                </span>
                <h3 className="text-3xl md:text-4xl font-display font-medium text-white group-hover:text-[#2DD4BF] transition-colors duration-300 underline decoration-white/5 underline-offset-8">
                   {project.Title || project.title}
                </h3>
             </div>
             <span className="text-white/20 font-display font-black text-2xl">{project.Year || project.year || "2024"}</span>
          </div>
       </div>
    </motion.div>
  );
}

function ProjectDetailModal({ project, onClose }) {
  // Helper to map common tech names to skillicons identifiers
  const getTechIcons = (stack) => {
    if (!stack) return "";
    let items = Array.isArray(stack) ? stack : stack.split(",").map(s => s.trim());
    
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
      'mongodb': 'mongodb',
      'supabase': 'supabase',
      'flask': 'flask',
      'express': 'express',
      'tensorflow': 'tensorflow',
      'sklearn': 'sklearn',
      'pandas': 'pandas',
      'docker': 'docker'
    };
    
    return items.map(s => {
      const lower = s.toLowerCase();
      return mapping[lower] || lower;
    }).join(",");
  };

  const iconsQuery = getTechIcons(project.TechStack || project.techStack);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-12 bg-black/90 backdrop-blur-3xl overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 50 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="w-full max-w-4xl h-auto max-h-[85vh] bg-[#0A0A0A] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Sticky Floating */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-[#2DD4BF] hover:text-black transition-all duration-300 group"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Hero Section */}
          <div className="relative h-[30vh] md:h-[40vh] w-full overflow-hidden">
            <Image 
               src={project.Img || project.image} 
               alt={project.Title || project.title} 
               fill
               priority
               sizes="(max-width: 768px) 100vw, 80vw"
               className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
          </div>

          {/* Content Section */}
          <div className="px-5 md:px-12 lg:px-16 pb-12 -mt-16 relative z-10">
            {/* Header Info */}
            <div className="space-y-4 mb-12">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-[#2DD4BF] font-bold text-[10px] tracking-widest uppercase">{project.Category || project.category || "Development"}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-white/40 font-bold text-[10px] tracking-widest uppercase">{project.Year || project.year || "2024"}</span>
              </div>

              <h2 className="text-3xl md:text-6xl font-display font-medium tracking-tighter leading-none text-white">
                {project.Title || project.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
              {/* Main Narrative */}
              <div className="md:col-span-2 space-y-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-sans uppercase tracking-[0.4em] text-white/20 font-black">Inside the project</h4>
                  <p className="text-lg md:text-xl text-white/60 leading-relaxed font-sans font-light">
                    {project.Description || project.description}
                  </p>
                </div>
              </div>

              {/* Sidebar Details */}
              <div className="space-y-8">
                {iconsQuery && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-sans uppercase tracking-[0.4em] text-white/20 font-black">Technologies</h4>
                    <div className="p-3 md:p-5 rounded-2xl bg-white/5 border border-white/5">
                      <img 
                        src={`https://skillicons.dev/icons?i=${iconsQuery}&theme=dark&perline=3`} 
                        alt="Tech Stack" 
                        className="w-full h-auto object-contain max-w-[180px] md:max-w-none mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4">
              {project.Link && (
                <motion.a 
                  href={project.Link}
                  target="_blank"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 bg-[#2DD4BF] text-black px-8 py-4 rounded-full font-bold text-base transition-all duration-300 whitespace-nowrap shadow-lg shadow-[#2DD4BF]/10"
                >
                  View Project <ArrowUpRight size={18} />
                </motion.a>
              )}
              <button 
                onClick={onClose}
                className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-white/10 transition-all duration-300 whitespace-nowrap"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
