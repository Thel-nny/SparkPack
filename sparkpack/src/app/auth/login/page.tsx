"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import validator from "validator";
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";

import PrivacyPolicyModal from '@/components/ui/PrivacyPolicyModal';
import TermsAndConditionsModal from '@/components/ui/TermsAndConditionsModal';

const MAX_LENGTH = {
  email: 255,
  password: 128,
};

export default function Login() {
  const router = useRouter();
  const callbackUrl = "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", submit: "" });
  const [isLoading, setIsLoading] = useState(false);

  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "", submit: "" };

    if (!validator.isEmail(email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    } else if (email.length > MAX_LENGTH.email) {
      newErrors.email = `Email cannot exceed ${MAX_LENGTH.email} characters.`;
      isValid = false;
    }

    if (!validator.isLength(password, { min: 8 })) {
      newErrors.password = "Password must be at least 8 characters.";
      isValid = false;
    } else if (password.length > MAX_LENGTH.password) {
      newErrors.password = `Password cannot exceed ${MAX_LENGTH.password} characters.`;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, submit: "" }));

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (result?.error) {
      console.error("Login error:", result.error);

      let submitMsg = "An error occurred during login.";
      if (
        result.error.includes("Email not found") ||
        result.error.includes("CredentialsSignin")
      ) {
        submitMsg = "Email not found. Please register first.";
      } else if (result.error.includes("Invalid email or password")) {
        submitMsg = "Invalid email or password.";
      } else if (
        result.error.includes("Please verify your email before logging in")
      ) {
        submitMsg = "Please verify your email before logging in.";
      }

      setErrors((prev) => ({ ...prev, submit: submitMsg }));
      setIsLoading(false);
      return;
    }

    const session = await getSession();
    console.log("Session data:", session);
    const userRole = session?.user?.role;

    if (userRole === "ADMIN") {
      router.push("/advisor/dashboard");
    } else {
      router.push("/client/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7f8] p-2 md:p-4">
      <div className="z-10 w-full max-w-md p-6 md:px-8 lg:px-10 rounded-lg bg-white bg-opacity-95 border-2 border-gray-400 shadow-md">
        <div className="flex flex-col items-center mb-2 md:mb-4">
          <Image
            src="/Furrest_Logo-04.svg"
            width={120}
            height={120}
            alt="Furrest logo"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
          />
          <p className="text-base md:text-lg font-semibold text-[#7eb238]">
            SparkPack
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              maxLength={MAX_LENGTH.email}
              className="w-full bg-white border-gray-400 text-gray-800 placeholder-gray-600 pr-10"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                maxLength={MAX_LENGTH.password}
                className="w-full bg-white border-gray-400 text-gray-800 placeholder-gray-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <div className="flex justify-between items-center">
            <a
              href="/auth/reset-password"
              className="text-sm text-[#8cc63f] hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#8cc63f] text-black hover:bg-[#7eb238]"
            >
              <div className="flex items-center justify-center gap-2 text-white">
                {isLoading && <Spinner size="small" />}
                <span>{isLoading ? "Logging in..." : "Log In"}</span>
              </div>
            </Button>
            {errors.submit && (
              <p className="text-red-500 text-xs mt-1">{errors.submit}</p>
            )}
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <a
              href={`/auth/register`}
              className="text-[#8cc63f] hover:underline"
            >
              Register here
            </a>
          </p>
        </div>
        <div className="mt-6 text-center text-xs text-gray-500">
          <a
            href="mailto:partnerships.iloilo@sparkpack.org"
            className="hover:underline"
          >
            Help
          </a>{" "}
          ·{" "}
          <button
            type="button"
            onClick={() => setIsPrivacyModalOpen(true)}
            className="ml-2 hover:underline focus:outline-none"
          >
            Privacy Policy
          </button>{" "}
          ·{" "}
          <button
            type="button"
            onClick={() => setIsTermsModalOpen(true)}
            className="ml-2 hover:underline focus:outline-none"
          >
            Terms and Conditions
          </button>
        </div>
      </div>

      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <TermsAndConditionsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </div>
  );
}