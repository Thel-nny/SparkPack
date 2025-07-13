"use client";

import React from 'react';
import { ApplicationFormData } from '@/types/applicationFormData';
import SummaryDetailsStep from './form-steps/SummaryDetailsStep'; // Adjust path if necessary
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

interface ApplicationSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: ApplicationFormData;
  onPrev: () => void; // Passed through to SummaryDetailsStep
  onNext: () => void; // Passed through to SummaryDetailsStep (for submission)
}

const ApplicationSummaryModal: React.FC<ApplicationSummaryModalProps> = ({
  isOpen,
  onClose,
  formData,
  onPrev,
  onNext,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-bold"
        >
          &times;
        </button>

        {/* Modal Content - SummaryDetailsStep */}
        <SummaryDetailsStep
          formData={formData}
          onPrev={onPrev}
          onNext={onNext}
        />

        {/* You might want to add a close button here as well, if the onNext/onPrev buttons are specific to the form flow */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Close Summary
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSummaryModal;