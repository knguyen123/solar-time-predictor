
import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PredictionResultProps {
  result: [number, number, number];
  onReset: () => void;
}

const PredictionResult: React.FC<PredictionResultProps> = ({result, onReset }) => {
  const [days, hours, mins] = result;
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Small delay to trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // // Calculate estimated completion date (days from now)
  // const getEstimatedDate = () => {
  //   const today = new Date();
  //   const estimatedDate = new Date(today);
  //   estimatedDate.setDate(today.getDate() + days);
    
  //   return estimatedDate.toLocaleDateString('en-US', {
  //     weekday: 'long',
  //     month: 'long', 
  //     day: 'numeric'
  //   });
  // };

  return (
    <div 
      className={`w-full max-w-2xl mx-auto py-6 px-4 transform transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg border border-solar-green/20 p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-solar-green/10 rounded-full flex items-center justify-center">
            <CheckCircle size={32} className="text-solar-green" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-center text-solar-darkGray mb-6">
          Your Installation Prediction
        </h3>
        
        <div className="flex flex-col md:flex-row md:items-center justify-center gap-6 mb-8">
          <div className="bg-solar-yellow/10 p-4 rounded-lg text-center">
            <p className="text-sm text-solar-darkGray/70 mb-1">Estimated Time</p>
            <p className="text-3xl font-bold text-solar-darkGray">
              {days} <span className="text-xl">days</span> {" "} 
              {hours} <span className="text-xl">hours</span> {" "}
              {mins} <span className="text-xl">mins</span>
            </p>
          </div>
          
          {/* <div className="bg-solar-blue/10 p-4 rounded-lg text-center flex-1">
            <p className="text-sm text-solar-darkGray/70 mb-1 flex items-center justify-center gap-1">
              <Calendar size={14} />
              <span>Expected Completion</span>
            </p>
            <p className="text-xl font-bold text-solar-darkGray">
              {getEstimatedDate()}
            </p>
          </div> */}
        </div>
        
        <div className="text-center text-gray-600 mb-8">
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={onReset}
            variant="outline"
            className="border-solar-blue text-solar-blue hover:bg-solar-blue/10"
          >
            Upload Another File
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
