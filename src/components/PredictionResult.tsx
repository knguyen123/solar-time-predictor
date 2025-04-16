
import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PredictionResultProps {
  results: {hours: number; mins: number }[];
  onReset: () => void;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ results, onReset }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`w-full max-w-2xl mx-auto py-6 px-4 transform transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg border border-solar-green/20 p-8">
        <h3 className="text-2xl font-bold text-center text-solar-darkGray mb-6">
          Your Installation Predictions
        </h3>

        <div className="flex flex-col gap-4">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-solar-yellow/10 p-4 rounded-lg text-center"
            >
              <p className="text-sm text-solar-darkGray/70 mb-1">
                Prediction {index + 1}
              </p>
              <p className="text-3xl font-bold text-solar-darkGray">
                {result.hours} <span className="text-xl">hours</span> {" "}
                {result.mins} <span className="text-xl">mins</span>
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6">
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