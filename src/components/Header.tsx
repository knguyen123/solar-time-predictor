
import React from 'react';
import { Sun } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-8 md:py-12 px-4 bg-gradient-to-r from-solar-blue/10 to-solar-green/10">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-3">
          <Sun size={32} className="text-solar-yellow animate-pulse" />
          <h1 className="text-3xl md:text-4xl font-bold text-solar-darkGray">
            Midwest<span className="text-solar-yellow">Solar</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
