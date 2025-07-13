'use client'; // This directive marks it as a Client Component

import React, { useEffect, useRef } from 'react';

// Define props for the modal for clear type checking
interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Effect to handle clicks outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If the modal is open and the click is outside the modal content, close it
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Add or remove event listener based on modal's open state
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function to remove the event listener when component unmounts or isOpen changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]); // Dependencies: Re-run if isOpen or onClose changes

  // Effect to handle the Escape key press to close the modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    } else {
      document.removeEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]); // Dependencies: Re-run if isOpen or onClose changes

  // If the modal is not open, don't render anything
  if (!isOpen) {
    return null;
  }

  // Render the modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div
        ref={modalRef} // Attach ref to the modal content div
        className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-semibold"
          aria-label="Close terms and conditions" // Accessibility improvement
        >
          &times;
        </button>

        {/* Modal Content - Terms and Conditions */}
        <div className="p-6 sm:p-8 md:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-[#8cc63f]">Terms and Conditions</h1>

          <p className="mb-4 sm:mb-6 text-base sm:text-lg text-gray-700">
            Welcome to the Terms and Conditions (&quot;Terms&quot;) of Furrest Pet Insurance, operated by SparkPack (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). These Terms govern your use of our website, services, and any insurance products you purchase through Furrest Pet Insurance.
          </p>
          <p className="mb-6 sm:mb-8 text-base sm:text-lg text-gray-700">
            By accessing or using any part of our website or services, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
          </p>

          {/* --- Section 1 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">1. Definitions</h2>
          <p className="mb-3 sm:mb-4 text-gray-700">
            To make these Terms clearer, here are some key definitions:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 mb-5 sm:mb-6 text-gray-700">
            <li className="mb-1"><strong>&quot;Company,&quot; &quot;We,&quot; &quot;Us,&quot; &quot;Our&quot;</strong>: Refers to SparkPack, the operator of Furrest Pet Insurance.</li>
            <li className="mb-1"><strong>&quot;Website&quot;</strong>: Refers to the Furrest Pet Insurance website and any associated web pages, applications, and digital platforms.</li>
            <li className="mb-1"><strong>&quot;User,&quot; &quot;You,&quot; &quot;Your&quot;</strong>: Refers to any person who accesses or uses the Website or Services.</li>
            <li className="mb-1"><strong>&quot;Services&quot;</strong>: Refers to the pet insurance products, claims processing, account management, and related functionalities provided by Furrest Pet Insurance.</li>
            <li className="mb-1"><strong>&quot;Policyholder&quot;</strong>: A User who has successfully purchased a pet insurance policy from Furrest Pet Insurance.</li>
            <li className="mb-1"><strong>&quot;Advisor&quot;</strong>: A User registered as an advisor or agent for SparkPack/Furrest Pet Insurance.</li>
            <li className="mb-1"><strong>&quot;Pet&quot;</strong>: The animal insured under a Furrest Pet Insurance policy.</li>
          </ul>

          {/* --- Section 2 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">2. Eligibility and User Accounts</h2>
          <ul className="list-disc pl-5 sm:pl-6 mb-5 sm:mb-6 text-gray-700">
            <li className="mb-1"><strong>Age Requirement</strong>: You must be at least 18 years old and legally capable of entering into binding contracts under Philippine law to create an account or purchase Services.</li>
            <li className="mb-1"><strong>Account Registration</strong>: When you create an account, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account details and for all activities that occur under your account.</li>
            <li className="mb-1"><strong>Account Termination</strong>: We reserve the right to suspend or terminate your account at our sole discretion if you violate these Terms or for any other reason deemed necessary for the security and integrity of our Services.</li>
          </ul>

          {/* --- Section 3 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">3. Insurance Products and Services</h2>
          <ul className="list-disc pl-5 sm:pl-6 mb-5 sm:mb-6 text-gray-700">
            <li className="mb-1"><strong>Product Information</strong>: Details about our pet insurance packages (Medical Care, Legacy, Medical &amp; Legacy) and add-ons are available on our Website. This information is for general guidance only and does not constitute an offer to insure.</li>
            <li className="mb-1"><strong>Policy Contract</strong>: Any insurance policy purchased through Furrest Pet Insurance is a separate contract between you and SparkPack (or its underwriting partner, if applicable). The specific terms, conditions, coverages, limitations, and exclusions of your policy will be detailed in your individual Policy Wording, which will be provided to you upon policy issuance.</li>
            <li className="mb-1"><strong>Accuracy of Information</strong>: You are solely responsible for ensuring that all information you provide during the application process is accurate and complete. Providing false or misleading information may result in the voiding of your policy or denial of claims.</li>
          </ul>

          {/* --- Section 4 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">4. Payments and Billing</h2>
          <ul className="list-disc pl-5 sm:pl-6 mb-5 sm:mb-6 text-gray-700">
            <li className="mb-1"><strong>Premiums</strong>: All premiums for insurance policies are displayed on the Website. You agree to pay all applicable premiums and any other charges associated with your policy by the due dates.</li>
            <li className="mb-1"><strong>Payment Methods</strong>: We accept various payment methods as indicated on our Website. You authorize us to charge your selected payment method for all amounts due.</li>
            <li className="mb-1"><strong>Late Payments</strong>: Failure to pay premiums on time may lead to the suspension or termination of your policy, as detailed in your Policy Wording.</li>
          </ul>

          {/* --- Section 5 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">5. Claims Process</h2>
          <ul className="list-disc pl-5 sm:pl-6 mb-5 sm:mb-6 text-gray-700">
            <li className="mb-1"><strong>Reporting Claims</strong>: Information on how to submit a claim is available on our Website and your Client Dashboard. You agree to follow the specified procedures and provide all necessary documentation for claim processing.</li>
            <li className="mb-1"><strong>Claim Assessment</strong>: All claims are subject to assessment and approval based on the terms and conditions outlined in your specific Policy Wording. SparkPack reserves the right to request additional information or conduct investigations as needed.</li>
            <li className="mb-1"><strong>Fraud</strong>: Any fraudulent claim or attempt to defraud SparkPack will result in the immediate voiding of the policy, denial of the claim, and may lead to legal action in accordance with Philippine law.</li>
          </ul>

          {/* --- Section 6 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">6. Prohibited Uses</h2>
          <p className="mb-3 sm:mb-4 text-gray-700">
            You agree not to use the Website or Services for any purpose that is unlawful or prohibited by these Terms, including but not limited to:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 mb-5 sm:mb-6 text-gray-700">
            <li className="mb-1">Engaging in any activity that is fraudulent, deceptive, or misleading.</li>
            <li className="mb-1">Attempting to gain unauthorized access to any part of the Website, accounts, or computer systems.</li>
            <li className="mb-1">Interfering with the operation of the Website or Services.</li>
            <li className="mb-1">Using the Services for any commercial purpose without our express written consent.</li>
            <li className="mb-1">Violating any applicable Philippine laws or regulations.</li>
          </ul>

          {/* --- Section 7 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">7. Intellectual Property</h2>
          <p className="mb-5 sm:mb-6 text-gray-700">
            All content on the Furrest Pet Insurance Website, including text, graphics, logos, images, software, and the &quot;SparkPack&quot; and &quot;Furrest Pet Insurance&quot; names, are the property of SparkPack or its licensors and are protected by Philippine and international copyright, trademark, and other intellectual property laws. You may not use any content from our Website without our prior written permission.
          </p>

          {/* --- Section 8 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">8. Disclaimers</h2>
          <ul className="list-disc pl-5 sm:pl-6 mb-5 sm:mb-6 text-gray-700">
            <li className="mb-1"><strong>&quot;As Is&quot; Basis</strong>: The Website and Services are provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.</li>
            <li className="mb-1"><strong>No Guarantee</strong>: We do not guarantee that the Website will be error-free, uninterrupted, secure, or that any defects will be corrected.</li>
            <li className="mb-1"><strong>Not Financial Advice</strong>: Information on the Website is for general informational purposes only and does not constitute financial, legal, or veterinary advice. You should consult with qualified professionals for specific advice.</li>
          </ul>

          {/* --- Section 9 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">9. Limitation of Liability</h2>
          <p className="mb-5 sm:mb-6 text-gray-700">
            To the fullest extent permitted by Philippine law, SparkPack, its directors, officers, employees, affiliates, agents, contractors, and licensors shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including without limitation, lost profits, lost revenue, lost data, or other similar damages, arising from your use of the Website or Services.
          </p>

          {/* --- Section 10 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">10. Indemnification</h2>
          <p className="mb-5 sm:mb-6 text-gray-700">
            You agree to indemnify, defend, and hold harmless SparkPack, its affiliates, directors, officers, employees, and agents from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys&apos; fees) arising from your violation of these Terms or your use of the Website or Services.
          </p>

          {/* --- Section 11 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">11. Governing Law and Jurisdiction</h2>
          <p className="mb-5 sm:mb-6 text-gray-700">
            These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Services shall be resolved exclusively in the competent courts of Iloilo City, Philippines.
          </p>

          {/* --- Section 12 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">12. Changes to These Terms</h2>
          <p className="mb-5 sm:mb-6 text-gray-700">
            We reserve the right, at our sole discretion, to update, change, or replace any part of these Terms by posting updates and changes to our Website. It is your responsibility to check our Website periodically for changes. Your continued use of or access to the Website or Services following the posting of any changes constitutes acceptance of those changes.
          </p>

          {/* --- Section 13 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">13. Contact Us</h2>
          <p className="mb-3 sm:mb-4 text-gray-700">
            If you have any questions about these Terms, please contact us at SparkPack:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 mb-6 text-gray-700">
            <li><strong>Email:</strong> <a href="sparkpackteam@gmail.com" className="text-[#8cc63f] hover:underline">sparkpackteam@gmail.com</a></li>
            <li><strong>Phone:</strong> <a href="tel:+63912 727 7767" className="text-[#8cc63f] hover:underline">(033) 329 1971</a></li>
            <li><strong>Address:</strong> Lopez Jaena Street, Jaro, Iloilo City 5000</li>
          </ul>

          <p className="text-xs sm:text-sm text-gray-500 mt-8 sm:mt-10 text-center"><strong>Last Updated:</strong> July 13, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;