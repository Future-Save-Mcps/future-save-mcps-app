import React, { useState, useRef, useEffect } from "react";

const EmailVerification = ({ onVerify }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30); // Countdown timer
  const inputRefs = useRef([]);

  // Handle OTP change
  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input field
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
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
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      alert("Please enter a valid 4-digit OTP.");
    } else {
      onVerify(enteredOtp); // Pass the OTP to the parent component
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl border">
      <h2 className="text-xl font-semibold text-center mb-2">Email Verification</h2>
      <p className="text-center text-gray-600 mb-6">
        We sent an OTP code to <strong>chinonsoa2@gmail.com</strong>
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
          <p className="text-gray-400">Send code again in 00:{timer < 10 ? `0${timer}` : timer}</p>
        ) : (
          <button
            className="text-primary w-full py-3 mt-4 mb-8 rounded-lg hover:bg-[#dbdada] bg-[#f1f1f1] font-medium"
            onClick={() => {
              setOtp(["", "", "", ""]);
              setTimer(30); // Reset the timer
            }}
          >
            Resend Code
          </button>
        )}
      </div>
      <button
        className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark"
        onClick={handleVerify}
      >
        Continue
      </button>
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
    </div>
  );
};

export default EmailVerification;
