'use client'; 

import React, { useEffect, useRef } from 'react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
          aria-label="Close privacy policy" // Accessibility improvement
        >
          &times;
        </button>

        {/* Modal Content - Privacy Policy */}
        <div className="p-6 sm:p-8 md:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 text-[#8cc63f]">Privacy Policy</h1>

          <p className="mb-4 sm:mb-6 text-base sm:text-lg text-gray-700">
            Welcome to Furrest Pet Insurance! We know your pet is family, and at SparkPack, we believe your personal information should be treated with the same love and care. This Privacy Policy explains how SparkPack (referred to as &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, shares, and protects your personal information when you use our Furrest Pet Insurance website, apply for insurance, manage your policy, or file a claim.
          </p>
          <p className="mb-6 sm:mb-8 text-base sm:text-lg text-gray-700">
            We&apos;ve designed this policy to be as clear and easy to understand as possible. If anything isn&apos;t clear, please don&apos;t hesitate to reach out to us!
          </p>

          {/* --- Section 1 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">1. What Information We Collect</h2>
          <p className="mb-3 sm:mb-4 text-gray-700">
            We collect information to provide you with top-notch pet insurance services and to continuously improve your experience with Furrest Pet Insurance.
          </p>
          
          <h3 className="text-lg sm:text-xl font-medium mb-2 text-gray-800">Information You Give Us Directly:</h3>
          <ul className="list-disc pl-5 sm:pl-6 mb-3 sm:mb-4 text-gray-700">
            <li className="mb-1"><strong>Account & Contact Info:</strong> When you create an account, apply for a policy, or contact us, you provide your name, address, email, phone number, and payment details.</li>
            <li className="mb-1"><strong>Pet Information:</strong> To offer the best coverage, we collect your pet&apos;s name, breed, age, gender, medical history, and veterinarian clinic details.</li>
            <li className="mb-1"><strong>Claim Information:</strong> When you file a claim, we gather details about the incident, veterinary invoices, and treatment records.</li>
            <li className="mb-1"><strong>Communication:</strong> We keep records of your interactions with us, like emails or chat messages, to help us serve you better.</li>
          </ul>

          <h3 className="text-lg sm:text-xl font-medium mb-2 text-gray-800">Information We Collect Automatically (Website & App Use):</h3>
          <ul className="list-disc pl-5 sm:pl-6 mb-5 sm:mb-6 text-gray-700">
            <li className="mb-1"><strong>Usage Data:</strong> Details about how you use our website (like pages you visit, time you spend, and features you use).</li>
            <li className="mb-1"><strong>Device Info:</strong> Information about the device you use (type, operating system, unique device identifiers).</li>
            <li className="mb-1"><strong>Location Data:</strong> General location inferred from your IP address (e.g., Iloilo City), which helps us understand our service areas and improve localized offerings.</li>
            <li className="mb-1"><strong>Cookies & Similar Technologies:</strong> We use cookies to remember your preferences, keep you logged in, and understand website traffic patterns. You can manage cookie settings in your browser at any time.</li>
          </ul>

          {/* --- Section 2 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">2. How We Use Your Information</h2>
          <p className="mb-3 sm:mb-4 text-gray-700">
            We use your information exclusively to:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 mb-5 sm:mb-6 text-gray-700">
            <li className="mb-1"><strong>Provide Furrest Pet Insurance Services:</strong> Process your applications and set up your policies, accurately calculate your insurance premiums, efficiently process and manage your claims, and handle payments and send you billing notices.</li>
            <li className="mb-1"><strong>Communicate With You:</strong> Send you important updates about your policy or ongoing claims, respond to your questions and provide support whenever you need it, and send you timely renewal reminders so your pet stays protected.</li>
            <li className="mb-1"><strong>Improve Our Services:</strong> Understand how our website and services are used so we can make them better, develop new features and expand our insurance products, and personalize your experience on our website (e.g., showing relevant offers for your pet).</li>
            <li className="mb-1"><strong>Ensure Security & Compliance:</strong> Detect and prevent fraud or any illegal activities, and comply with all legal and regulatory obligations in the Philippines, especially those set by the Insurance Commission.</li>
          </ul>

          {/* --- Section 3 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">3. How We Share Your Information</h2>
          <p className="mb-3 sm:mb-4 text-gray-700">
            We believe in protecting your trust. We do not sell your personal information. We only share it when it&apos;s absolutely necessary to provide our services or when legally required.
          </p>
          <ul className="list-disc pl-5 sm:pl-6 mb-5 sm:mb-6 text-gray-700">
            <li className="mb-1"><strong>With Veterinarians:</strong> To verify claims and understand your pet&apos;s health history, we share relevant medical history and claim details with your listed veterinarian(s).</li>
            <li className="mb-1"><strong>Service Providers:</strong> We partner with trusted third parties who help us run our business smoothly (like payment processors, secure cloud hosting services, and email service providers). They only access the information strictly necessary to perform their services for us and are bound by strict confidentiality agreements.</li>
            <li className="mb-1"><strong>Legal & Regulatory Reasons:</strong> We may share information if mandated by law, court order, or official government requests (e.g., from the Insurance Commission of the Philippines).</li>
            <li className="mb-1"><strong>Business Transfers:</strong> In the unlikely event that SparkPack (or Furrest Pet Insurance) is acquired by or merges with another company, your information may be transferred to the new entity. We&apos;ll always notify you if such a transfer occurs.</li>
          </ul>

          {/* --- Section 4 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">4. How We Protect Your Information</h2>
          <p className="mb-3 sm:mb-4 text-gray-700">
            Your data&apos;s security is a top priority for us.
          </p>
          <ul className="list-disc pl-5 sm:pl-6 mb-5 sm:mb-6 text-gray-700">
            <li className="mb-1">We use industry-standard security measures (like encryption and secure servers) to protect your information from unauthorized access, use, or disclosure.</li>
            <li className="mb-1">Access to your personal information is strictly limited to our authorized SparkPack employees and trusted service providers who need it to perform their specific job functions.</li>
            <li className="mb-1">While we strive for the highest level of security, please remember that no method of transmission over the internet or electronic storage is 100% secure.</li>
          </ul>

          {/* --- Section 5 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">5. Your Choices & Rights</h2>
          <p className="mb-3 sm:mb-4 text-gray-700">
            You have important rights regarding your personal information:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 mb-5 sm:mb-6 text-gray-700">
            <li className="mb-1"><strong>Access & Correction:</strong> You can easily access and update most of your personal and pet information directly through your Client Dashboard on the Furrest Pet Insurance website. If you need any assistance, just contact us.</li>
            <li className="mb-1"><strong>Communication Preferences:</strong> You can choose what types of communications you receive from us (e.g., opting in or out of marketing emails).</li>
            <li className="mb-1"><strong>Cookies:</strong> You can configure your web browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. Please note that disabling cookies may affect some functionalities on the Furrest Pet Insurance website.</li>
          </ul>

          {/* --- Section 6 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">6. Children&apos;s Privacy</h2>
          <p className="mb-5 sm:mb-6 text-gray-700">
            Our services are designed for adults. Furrest Pet Insurance is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we discover we have collected such information, we will take immediate steps to delete it.
          </p>

          {/* --- Section 7 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">7. Changes to This Privacy Policy</h2>
          <p className="mb-5 sm:mb-6 text-gray-700">
            We may update this Privacy Policy periodically to reflect changes in our business practices or legal requirements. We&apos;ll notify you of any significant changes by posting the new policy prominently on our website and, where appropriate, by email. We encourage you to review this page regularly to stay informed.
          </p>

          {/* --- Section 8 --- */}
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#8cc63f]">8. Contact Us</h2>
          <p className="mb-3 sm:mb-4 text-gray-700">
            If you have any questions about this Privacy Policy or our data practices, please don&apos;t hesitate to contact us at SparkPack:
          </p>
          <ul className="list-disc pl-5 sm:pl-6 mb-6 text-gray-700">
            <li><strong>Email:</strong> <a href="mailto:sparkpackteam@gmail.com" className="text-[#8cc63f] hover:underline">sparkpackteam@gmail.com</a></li>
            <li><strong>Phone:</strong> <a href="tel:+63912 727 7767" className="text-[#8cc63f] hover:underline">(033) 329 1971</a></li>
            <li><strong>Address:</strong> Lopez Jaena Street, Jaro, Iloilo City 5000</li>
          </ul>

          <p className="text-xs sm:text-sm text-gray-500 mt-8 sm:mt-10 text-center"><strong>Last Updated:</strong> July 13, 2025</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;