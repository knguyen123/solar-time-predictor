
import React from 'react';
import { Sun, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-8 px-4 bg-solar-darkGray text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Sun size={24} className="text-solar-yellow" />
            <h2 className="text-xl font-bold">
              Midwest<span className="text-solar-yellow">Solar</span>
            </h2>
          </div>
          
          
        </div>
        
        <div className="text-center border-t border-white/10 pt-6 text-sm text-white/70">
          <p>© {new Date().getFullYear()} MidwestSolar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
