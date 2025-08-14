'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  stepTitles
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isLast = index === stepTitles.length - 1;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green border-green text-white'
                      : isActive
                      ? 'bg-gold border-gold text-bg-main'
                      : 'bg-main/10 border-main/20 text-muted'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold text-sm">{stepNumber}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center max-w-20 ${
                    isActive ? 'text-main' : 'text-muted'
                  }`}
                >
                  {title}
                </span>
              </div>
              
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-4 transition-all duration-200 ${
                    isCompleted ? 'bg-green' : 'bg-main/20'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
