"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { CheckedState } from "@radix-ui/react-checkbox";

// --- Import the PrivacyPolicyModal ---
import PrivacyPolicyModal from '@/components/ui/PrivacyPolicyModal'; // Adjust the path if you placed it elsewhere

// Re-defining Spinner here for self-containment, but ideally it's imported
const Spinner = ({ size = "small" }) => {
  const spinnerSize = size === "small" ? "h-4 w-4" : "h-6 w-6";
  return (
    <div className={`animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${spinnerSize}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const MAX_LENGTH = {
  firstName: 50,
  lastName: 50,
  phoneNumber: 20,
  email: 255,
  password: 128,
};

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPolicyholder, setIsPolicyholder] = useState(false);
  const [isAdvisor, setIsAdvisor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ firstName: "", lastName: "", phoneNumber: "", email: "", password: "", confirmPassword: "", role: "", submit: "" });
  const [isLoading, setIsLoading] = useState(false);

  // --- State for the Privacy Policy Modal ---
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);


  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Phone number validation
  const isValidPhoneNumber = (number: string) => {
    return /^\+?[0-9]{7,20}$/.test(number.trim());
  };

  const isLengthValid = (text: string, min: number, max: number) => {
    return text.length >= min && text.length <= max;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { firstName: "", lastName: "", phoneNumber: "", email: "", password: "", confirmPassword: "", role: "", submit: "" };

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required.";
      isValid = false;
    } else if (!isLengthValid(firstName, 1, MAX_LENGTH.firstName)) {
      newErrors.firstName = `First name cannot exceed ${MAX_LENGTH.firstName} characters.`;
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      isValid = false;
    } else if (!isLengthValid(lastName, 1, MAX_LENGTH.lastName)) {
      newErrors.lastName = `Last name cannot exceed ${MAX_LENGTH.lastName} characters.`;
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required.";
      isValid = false;
    } else if (!isValidPhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number (digits only, optional '+' at start).";
      isValid = false;
    } else if (!isLengthValid(phoneNumber, 7, MAX_LENGTH.phoneNumber)) {
      newErrors.phoneNumber = `Phone number must be between 7 and ${MAX_LENGTH.phoneNumber} digits.`;
      isValid = false;
    }

    if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    } else if (!isLengthValid(email, 1, MAX_LENGTH.email)) {
      newErrors.email = `Email cannot exceed ${MAX_LENGTH.email} characters.`;
      isValid = false;
    }

    if (!isLengthValid(password, 8, MAX_LENGTH.password)) {
      newErrors.password = "Password must be at least 8 characters and cannot exceed 128 characters.";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    if (!isPolicyholder && !isAdvisor) {
      newErrors.role = "Please select if you are a Policyholder or an Advisor.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors(prev => ({ ...prev, submit: "" }));

    try {
      let role = "";
      if (isAdvisor) role = "ADMIN";
      else if (isPolicyholder) role = "CUSTOMER";

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: firstName, // Ensure your backend expects 'username' or adjust to 'firstName'
          email,
          password,
          role, // Send role to backend
          // You might also want to send lastName and phoneNumber to the backend
          lastName,
          phoneNumber
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrors(prev => ({ ...prev, submit: data.error || "Registration failed." }));
        setIsLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      console.log("Registration simulated successfully!");
      window.location.href = "/auth/login?registered=true"; // Redirect upon successful registration

      console.log("Attempting to register with:", { firstName, lastName, phoneNumber, email, password, isPolicyholder, isAdvisor });
    } catch (error) {
      console.error("Registration error:", error); // Use actual error
      const submitMsg = "An unexpected error occurred during registration.";
      setErrors(prev => ({ ...prev, submit: submitMsg }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7f8] p-2 md:p-4">
      <div className="z-10 w-full max-w-md p-4 md:px-6 lg:px-8 rounded-lg bg-white bg-opacity-95 border-2 border-gray-400 shadow-md">
        <div className="flex flex-col items-center mb-1 md:mb-2">
          <img src="/Furrest_Logo-04.svg" width={100} height={100} alt="Furrest logo" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full" />
          <p className="text-base md:text-lg font-semibold text-[#7eb238]">
            SparkPack
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* First Name and Last Name */}
          <div className="flex gap-x-2">
            <div className="flex-1">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-800">First Name</label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                placeholder="First name"
                maxLength={MAX_LENGTH.firstName}
                className="w-full bg-white border-gray-400 text-gray-800 placeholder-gray-600 h-9 text-sm"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-800">Last Name</label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                placeholder="Last name"
                maxLength={MAX_LENGTH.lastName}
                className="w-full bg-white border-gray-400 text-gray-800 placeholder-gray-600 h-9 text-sm"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-800">Phone Number</label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
              placeholder="e.g., +639171234567"
              maxLength={MAX_LENGTH.phoneNumber}
              className="w-full bg-white border-gray-400 text-gray-800 placeholder-gray-600 h-9 text-sm"
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* Email, Password, Confirm Password fields */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="Enter your email"
              maxLength={MAX_LENGTH.email}
              className="w-full bg-white border-gray-400 text-gray-800 placeholder-gray-600 h-9 text-sm"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800">Password</label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Enter your password"
                maxLength={MAX_LENGTH.password}
                className="w-full bg-white border-gray-400 text-gray-800 placeholder-gray-600 pr-10 h-9 text-sm"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800">Confirm Password</label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                maxLength={MAX_LENGTH.password}
                className="w-full bg-white border-gray-400 text-gray-800 placeholder-gray-600 pr-10 h-9 text-sm"
              />
              <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <div className="flex flex-col space-y-1 mt-2">
            <div className="flex items-center">
              <Checkbox
                id="policyholder"
                checked={isPolicyholder}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') {
                    setIsPolicyholder(checked);
                    if (checked) setIsAdvisor(false); // Uncheck advisor if policyholder is checked
                  }
                }}
                className="mr-2"
              />
              <label htmlFor="policyholder" className="text-sm font-medium text-gray-800">Register as Policyholder</label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="advisor"
                checked={isAdvisor}
                onCheckedChange={(checked: CheckedState) => {
                  if (typeof checked === 'boolean') {
                    setIsAdvisor(checked);
                    if (checked) setIsPolicyholder(false); // Uncheck policyholder if advisor is checked
                  }
                }}
                className="mr-2"
              />
              <label htmlFor="advisor" className="text-sm font-medium text-gray-800">Register as Advisor</label>
            </div>
          </div>
          {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
          <div>
            <Button type="submit" disabled={isLoading} className="w-full bg-[#8cc63f] text-black hover:bg-[#7eb238] h-10 text-sm">
              <div className="flex items-center justify-center gap-2 text-white">
                {isLoading && <Spinner size="small" />}
                <span>{isLoading ? "Registering..." : "Register"}</span>
              </div>
            </Button>
            {errors.submit && <p className="text-red-500 text-xs mt-1">{errors.submit}</p>}
          </div>
        </form>
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-500">Already have an account? <a href={`/auth/login`} className="text-[#8cc63f] hover:underline">Log in here</a></p>
        </div>
        <div className="mt-4 text-center text-xs text-gray-500">
          <a href="mailto:partnerships.iloilo@sparkpack.org" className="hover:underline">Help</a> · {/* Note: Your email says iloilo, but location is Cebu. Confirm correct email */}
          {/* --- Modified Privacy Policy Link to open modal --- */}
          <button
            type="button" // Use type="button" to prevent form submission
            onClick={() => setIsPrivacyModalOpen(true)}
            className="ml-2 hover:underline focus:outline-none" // Tailwind for button styling
          >
            Privacy Policy
          </button>{" "}
          ·{" "}
          <a href="/terms-and-conditions" className="ml-2 hover:underline">
            Terms and Conditions
          </a>
        </div>
      </div>

      {/* --- Render the Privacy Policy Modal --- */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}