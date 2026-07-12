import React from 'react';
import { Code, FileText, PlayCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold tracking-tighter">
              AE
            </div>
            <span className="font-bold text-xl text-white">AE-MAP</span>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
              <Code className="w-5 h-5" />
              <span>GitHub</span>
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
              <span>Read Paper</span>
            </a>
            <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
              <PlayCircle className="w-5 h-5" />
              <span>Watch Demo</span>
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
          <p>© {new Date().getFullYear()} AE-MAP Research Project. Developed for academic demonstration.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
