'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useRegistrationStore } from '@/lib/stores/registration-store';
import { ArrowLeft, ArrowRight, Zap } from 'lucide-react';

import ItemDetailsStep from './ItemDetailsStep';
import UploadProofStep from './UploadProofStep';
import ConfirmAndMintStep from './ConfirmAndMintStep';

const steps = [
  { number: 1, title: 'Item Details', description: 'Basic information' },
  { number: 2, title: 'Upload Proof', description: 'Documentation' },
  { number: 3, title: 'Confirm & Mint', description: 'Final review' }
];

export default function RegistrationForm() {
  const {
    currentStep,
    nextStep,
    prevStep,
    itemDetails,
    proofFiles,
    isLoading,
    setLoading
  } = useRegistrationStore();

  const canProceedFromStep1 = itemDetails.name.trim() !== '' && 
                               itemDetails.category !== '' && 
                               itemDetails.value.trim() !== '';

  const canProceedFromStep2 = proofFiles.receipt && proofFiles.identification;

  const getStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <ItemDetailsStep key="step-1" />;
      case 2:
        return <UploadProofStep key="step-2" />;
      case 3:
        return <ConfirmAndMintStep key="step-3" />;
      default:
        return <ItemDetailsStep key="step-1" />;
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && canProceedFromStep1) {
      nextStep();
    } else if (currentStep === 2 && canProceedFromStep2) {
      nextStep();
    }
  };

  const handleMint = async () => {
    setLoading(true);
    
    // Simulate minting process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would integrate with blockchain
    console.log('Minting:', { itemDetails, proofFiles });
    
    setLoading(false);
    
    // Show success or redirect
    alert('Successfully minted! (This is just a simulation)');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return canProceedFromStep1;
      case 2:
        return canProceedFromStep2;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-main via-bg-main to-bg-surface py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-clash text-main mb-4">
              Register Your <span className="text-gold">Item</span>
            </h1>
            <p className="text-xl text-muted max-w-2xl mx-auto">
              Create a tamperproof digital certificate for your valuable assets
            </p>
          </motion.div>

          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-6">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        currentStep >= step.number
                          ? 'bg-gold border-gold text-bg-main'
                          : 'border-main/30 text-muted'
                      }`}
                    >
                      {step.number}
                    </div>
                    <div className="text-center mt-2">
                      <p className={`text-sm font-medium ${
                        currentStep >= step.number ? 'text-main' : 'text-muted'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-muted">{step.description}</p>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mx-8 mt-[-24px]">
                      <div
                        className={`h-full transition-all duration-500 ${
                          currentStep > step.number ? 'bg-gold' : 'bg-main/20'
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Step {currentStep} of {steps.length}</span>
                <span className="text-sm text-muted">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </motion.div>

          {/* Step Content */}
          <div className="mb-12">
            <AnimatePresence mode="wait">
              {getStepComponent()}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-between max-w-2xl mx-auto"
          >
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex-1 text-center">
              <p className="text-xs text-muted">
                {currentStep === 3 
                  ? 'Ready to create your certificate' 
                  : `${2 - (currentStep - 1)} steps remaining`
                }
              </p>
            </div>

            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold/90 text-bg-main"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleMint}
                disabled={isLoading}
                className="flex items-center gap-2 px-8 py-3 bg-green hover:bg-green/90 text-bg-main"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-bg-main/20 border-t-bg-main rounded-full animate-spin" />
                    Minting...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Mint Onchain
                  </>
                )}
              </Button>
            )}
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-muted">
              Need help? Contact our support team or check our{' '}
              <a href="#" className="text-gold hover:text-gold/80 transition-colors">
                documentation
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
