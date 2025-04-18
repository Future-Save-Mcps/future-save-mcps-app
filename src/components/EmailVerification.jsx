import React, { useState, useRef, useEffect } from "react";
import { useApiGet, useApiPost } from "../hooks/useApi";
import FormButton from "./FormBtn";
import { toast } from "react-toastify";

const EmailVerification = ({ email, onVerify, agreement = false, userId, isLoading }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30); // Countdown timer
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const [resending, setResending] = useState(false);
  const handleChange = (value, index) => {
    // Allow only alphanumeric characters and convert to uppercase
    value = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    const newOtp = [...otp];

    // If multiple characters are pasted
    if (value.length > 1) {
      value.split("").forEach((char, i) => {
        if (index + i < newOtp.length) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);

      // Move focus to the appropriate input field
      const nextIndex = Math.min(index + value.length, newOtp.length - 1);
      inputRefs.current[nextIndex]?.focus();
    } else {
      // Single character input
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input field
      if (value && index < newOtp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Countdown timer logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Verify OTP
  const handleVerify = () => {
    setLoading(true);
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      toast.error("Please enter a valid OTP.");
    } else {
      onVerify(enteredOtp); // Pass the OTP to the parent component
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true);
    setOtp(["", "", "", "", "", ""]);
    const result = await post(
      `/auth/${userId}otp/resend`
   
    );

    if (result.success && result.data) {
      setTimer(30);
    }
    setResending(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl border">
      <h2 className="text-xl font-semibold text-center mb-2">
        Email Verification
      </h2>
      <p className="text-center text-gray-600 mb-6">
        We sent an OTP code to <strong>{email}</strong>
      </p>
      <div className="flex justify-center gap-4 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            value={digit}
            maxLength={1}
            className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
          />
        ))}
      </div>
      <div className="text-center mb-6">
        {timer > 0 ? (
          <p className="text-gray-400">
            Send code again in 00:{timer < 10 ? `0${timer}` : timer}
          </p>
        ) : (
          <button
            disabled={resending}
            className="text-primary w-full py-3 mt-4 mb-8 rounded-lg disabled:border disabled:bg-white disabled:text-[#c0c0c0]  hover:bg-[#dbdada] bg-[#f1f1f1] font-medium"
            onClick={handleResend}
          >
            {resending ? "Resending..." : " Resend Code"}
          </button>
        )}
      </div>
      {/* <button
        className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark"
        onClick={handleVerify}
      >
        Continue
      </button> */}
      <FormButton
        width="100%"
        onClick={handleVerify}
        text="Continue"
        isLoading={loading || isLoading}
        disabled={loading || isLoading}
      />
      {agreement && (
        <p className="text-center text-gray-500 mt-4 text-sm">
          By clicking continue, you agree to our{" "}
          <a href="#" className="text-primary font-medium">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary font-medium">
            User Agreement
          </a>
          .
        </p>
      )}
    </div>
  );
};

export default EmailVerification;
