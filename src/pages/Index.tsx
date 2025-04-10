
import React, { useState } from 'react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import PredictionResult from '@/components/PredictionResult';
import Footer from '@/components/Footer';

const Index = () => {
  const [predictionDays, setPredictionDays] = useState<number | null>(null);

  const handleFileProcessed = (days: number) => {
    setPredictionDays(days);
    // Scroll to results
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight / 2,
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleReset = () => {
    setPredictionDays(null);
    // Scroll back to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-solar-lightGray">
      <Header />
      
      <main className="flex-1 w-full max-w-6xl mx-auto py-8 md:py-12 px-4">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-solar-darkGray mb-4">
            Solar Installation Time Predictor
          </h2>
          <p className="text-lg text-solar-darkGray/80 max-w-2xl mx-auto">
            Upload your property data file to get an estimated timeline for your solar panel installation.
          </p>
        </div>
        
        {!predictionDays && <FileUpload onFileProcessed={handleFileProcessed} />}
        
        {predictionDays !== null && (
          <PredictionResult days={predictionDays} onReset={handleReset} />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
