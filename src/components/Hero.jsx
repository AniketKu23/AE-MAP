import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative pt-20 pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6"
          >
            Three languages. <br className="hidden md:block"/> One translator.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed"
          >
            AE-MAP uses deep learning to merge three different types of patient data — DNA, RNA, and protein measurements — into one unified picture, so researchers can discover hidden disease subtypes that no single data type could reveal alone.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a 
              href="#live-demo"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-teal-600 hover:bg-teal-700 shadow-lg hover:shadow-xl transition-all gap-2"
            >
              See It In Action
              <ChevronRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>

        {/* Animated Visual: Converging streams */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="mt-20 flex justify-center"
        >
          <div className="relative w-full max-w-lg h-64">
            <svg viewBox="0 0 400 250" className="w-full h-full overflow-visible">
              {/* DNA Stream (Genomics) */}
              <motion.path 
                d="M 50,50 C 150,50 200,125 350,125" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="12" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              />
              <text x="30" y="45" className="text-sm fill-slate-500 font-medium">DNA (Genomics)</text>
              
              {/* RNA Stream (Transcriptomics) */}
              <motion.path 
                d="M 50,125 C 150,125 200,125 350,125" 
                fill="none" 
                stroke="#8b5cf6" 
                strokeWidth="12" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.2, repeat: Infinity, repeatType: "reverse" }}
              />
              <text x="30" y="120" className="text-sm fill-slate-500 font-medium">RNA (Transcriptomics)</text>

              {/* Protein Stream (Proteomics) */}
              <motion.path 
                d="M 50,200 C 150,200 200,125 350,125" 
                fill="none" 
                stroke="#14b8a6" 
                strokeWidth="12" 
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.4, repeat: Infinity, repeatType: "reverse" }}
              />
              <text x="30" y="220" className="text-sm fill-slate-500 font-medium">Protein (Proteomics)</text>
              
              {/* Bottleneck/Unified Output */}
              <circle cx="350" cy="125" r="15" fill="#0f766e" />
              <text x="375" y="130" className="text-sm fill-slate-700 font-bold">Unified Profile</text>
            </svg>
          </div>
        </motion.div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-50 blur-3xl opacity-50"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-blue-50 blur-3xl opacity-50"></div>
      </div>
    </section>
  );
};

export default Hero;
