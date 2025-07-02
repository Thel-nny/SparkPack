"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

const Spinner = ({ size = "small" }) => {
  const spinnerSize = size === "small" ? "h-4 w-4" : "h-6 w-6";
  return (
    <div className={`animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${spinnerSize}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const MAX_LENGTH = {
  username: 50,
  email: 255,
  password: 128,
};

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ username: "", email: "", password: "", confirmPassword: "", submit: "" });
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isLengthValid = (text: string, min: number, max: number) => {
    return text.length >= min && text.length <= max;
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", email: "", password: "", confirmPassword: "", submit: "" };

    if (!username.trim()) {
      newErrors.username = "Username is required.";
      isValid = false;
    } else if (!isLengthValid(username, 1, MAX_LENGTH.username)) {
      newErrors.username = `Username cannot exceed ${MAX_LENGTH.username} characters.`;
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

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors(prev => ({ ...prev, submit: "" }));

    try {
      console.log("Attempting to register with:", { username, email, password });

      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log("Registration simulated successfully!");
      window.location.href = "/auth/login?registered=true";

    } catch (error: any) {
      console.error("Simulated registration error:", error);
      let submitMsg = "A simulated error occurred during registration.";
      setErrors(prev => ({ ...prev, submit: submitMsg }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7f8] p-2 md:p-4">
      <div className="z-10 w-full max-w-md p-6 md:px-8 lg:px-10 rounded-lg bg-white bg-opacity-95 border-2 border-gray-400 shadow-md">
        <div className="flex flex-col items-center mb-2 md:mb-4">
          <img src="/Furrest_Logo-04.svg" width={120} height={120} alt="Placeholder logo" className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full" />
          <p className="text-base md:text-lg font-semibold text-[#7eb238]">
            SparkPack
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-800 mb-1">Username</label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              placeholder="Enter your username"
              maxLength={MAX_LENGTH.username}
              className="w-full bg-white border-gray-400 text-gray-800 placeholder-gray-600"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="Enter your email"
              maxLength={MAX_LENGTH.email}
              className="w-full bg-white border-gray-400 text-gray-800 placeholder-gray-600"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">Password</label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Enter your password"
                maxLength={MAX_LENGTH.password}
                className="w-full bg-white border-gray-400 text-gray-800 placeholder-gray-600 pr-10"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mb-1">Confirm Password</label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                maxLength={MAX_LENGTH.password}
                className="w-full bg-white border-gray-400 text-gray-800 placeholder-gray-600 pr-10"
              />
              <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300">
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <div>
            <Button type="submit" disabled={isLoading} className="w-full bg-[#8cc63f] text-black hover:bg-[#7eb238]">
              <div className="flex items-center justify-center gap-2 text-white">
                {isLoading && <Spinner size="small" />}
                <span>{isLoading ? "Registering..." : "Register"}</span>
              </div>
            </Button>
            {errors.submit && <p className="text-red-500 text-xs mt-1">{errors.submit}</p>}
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">Already have an account? <a href={`/auth/login`} className="text-[#8cc63f] hover:underline">Log in here</a></p>
        </div>
        <div className="mt-6 text-center text-xs text-gray-500">
          <a href="mailto:partnerships.iloilo@sparkpack.org" className="hover:underline">Help</a> · <a href="/privacy-policy" className="ml-2 hover:underline">Privacy Policy</a> · <a href="/terms-and-conditions" className="ml-2 hover:underline">Terms and Conditions</a>
        </div>
      </div>
    </div>
  );
}