"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming you have shadcn/ui Checkbox
import { Label } from '@/components/ui/label';       // Assuming you have shadcn/ui Label
import { Spinner } from '@/components/ui/spinner';   // Assuming you have a Spinner component for loading
import { ApplicationFormData } from '@/types/formData';

interface SubmitStepProps {
  formData: ApplicationFormData; // The full form data, useful for final review/context
  onPrev: () => void;
  onSubmit: () => void; // The function to trigger the actual form submission (from NewApplicationForm)
  isSubmitting: boolean; // To show loading state and disable button
}

const SubmitStep: React.FC<SubmitStepProps> = ({ formData, onPrev, onSubmit, isSubmitting }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleCheckboxChange = (checked: boolean) => {
    setAgreedToTerms(checked);
  };

  const handleSubmitClick = () => {
    if (agreedToTerms) {
      onSubmit(); // Call the parent's onSubmit function
    } else {
      alert('Please agree to the terms and conditions before submitting.');
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-[#8cc63f]">Sign & Submit Application</h2>
        <p className="text-gray-700 mb-6">
          You are almost done! Please read the declaration below and click "Submit Application" to finalize.
        </p>

        {/* Final Declaration */}
        <div className="mb-8 p-6 border rounded-lg shadow-sm bg-white">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Declaration and Agreement</h3>
          <div className="space-y-4 text-gray-700">
            <p>
              I hereby declare that all information provided in this application is true, complete, and accurate to the best of my knowledge and belief. I understand that any false statements or misrepresentations may result in the denial of coverage or voidance of the policy.
            </p>
            <p>
              I agree to the terms and conditions of the pet insurance policy, which I have had the opportunity to review.
            </p>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id="agreeToTerms"
                checked={agreedToTerms}
                onCheckedChange={handleCheckboxChange}
                disabled={isSubmitting}
                className="h-5 w-5 border-[#8cc63f] data-[state=checked]:bg-[#8cc63f] data-[state=checked]:text-white"
              />
              <Label htmlFor="agreeToTerms" className="text-sm font-medium text-gray-800 cursor-pointer">
                I agree to the terms and conditions and confirm the accuracy of the information provided.
              </Label>
            </div>
          </div>
        </div>

      </div>

      {/* Navigation and Submit Buttons */}
      <div className="flex justify-between mt-4">
        <Button
          onClick={onPrev}
          disabled={isSubmitting} // Disable navigation during submission
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Previous: Summary
        </Button>

        <Button
          onClick={handleSubmitClick}
          disabled={isSubmitting || !agreedToTerms} // Disable if submitting or terms not agreed
          className="bg-[#8cc63f] hover:bg-[#7eb238] text-white font-bold py-2 px-4 rounded relative"
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 h-4 w-4 animate-spin" /> Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </Button>
      </div>
    </div>
  );
};

export default SubmitStep;