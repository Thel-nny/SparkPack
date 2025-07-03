"use client";

import React from 'react';

interface Step {
  id: number;
  name: string;
}

interface ApplicationStepNavbarProps {
  currentStepId: number; 
}

const steps: Step[] = [
  { id: 1, name: 'Client Details' },
  { id: 2, name: 'Pet Details' },
  { id: 3, name: 'Product Details' },
  { id: 4, name: 'Payment Details' },
  { id: 5, name: 'Evidence' },
  { id: 6, name: 'Summary' },
  { id: 7, name: 'Sign & Submit' },
];

const ApplicationStepNavbar: React.FC<ApplicationStepNavbarProps> = ({ currentStepId }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Form Step Navigation Items */}
          <div className="flex-1 flex justify-center items-center space-x-6 lg:space-x-8">
            {steps.map((step) => {
              // Determine if the current step is active or has been completed
              const isActive = currentStepId === step.id;
              const isCompleted = currentStepId > step.id;

              // Base classes for each step item
              const stepClasses = `
                relative flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200
                after:absolute after:top-1/2 after:right-0 after:block after:w-8 lg:after:w-16 after:h-px after:bg-gray-300 after:-translate-y-1/2 after:translate-x-full
              `;
              // Remove the 'after' pseudo-element for the last step
              const lastStepClass = step.id === steps.length ? 'after:hidden' : '';


              return (
                <div key={step.id} className={`${stepClasses} ${lastStepClass}`}>
                  {/* Step indicator circle */}
                  <div
                    className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2
                      ${isActive
                        ? 'bg-[#8cc63f] text-white' // Active step circle
                        : isCompleted
                          ? 'bg-[#e6f4d9] text-[#7eb238]' // Completed step circle (lighter green)
                          : 'bg-gray-200 text-gray-500' // Inactive step circle
                      }
                    `}
                  >
                    {isCompleted ? (
                      // Checkmark for completed steps
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      step.id // Step number for current/upcoming steps
                    )}
                  </div>
                  {/* Step Name */}
                  <span
                    className={`
                      whitespace-nowrap
                      ${isActive
                        ? 'text-[#7eb238] font-semibold'
                        : isCompleted
                          ? 'text-[#342d47] font-medium' 
                          : 'text-gray-600' 
                      }
                    `}
                  >
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ApplicationStepNavbar;