import React from "react";
import { useForm } from "react-hook-form";
import FormFieldComp from "./form/FormFieldComp";
import EmailVerification from "./EmailVerification";
import { useState } from "react";
import AccountCompletion from "./AccountCompletion";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 3) {
      navigate("/user", { replace: true });
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleVerify = (otp) => {
    console.log("Entered OTP:", otp);
    alert("Verification successful!");
    navigate("/user", { replace: true });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    handleNext();
  };

  const password = watch("password");

  return (
    <div className="flex w-[100%] ">
      <div className=" m-auto flex-1 mt-10 px-[10%]">
        <div>
          {step === 1 && (
            <>
              <h2 className="text-3xl font-semibold mb-4">Login</h2>
              <p className="text-sm mb-[50px]">
                Don’t have an account?{" "}
                <a
                  href="/register"
                  className="text-primary ml-2  font-semibold"
                >
                  Sign Up
                </a>
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid   gap-4 mb-4">
                  <FormFieldComp
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    register={register}
                    validation={{
                      required: "Email is required",
                      pattern: {
                        value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                        message: "Enter a valid email address",
                      },
                    }}
                    errors={errors}
                  />
                </div>

                <FormFieldComp
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  register={register}
                  validation={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  }}
                  errors={errors}
                />

                <p className="text- font-semibold mb-[50px] flex  justify-between">
                  <span></span>
                  <a href="/register" className="text-primary font-semibold">
                    Forgot Password?
                  </a>
                </p>

                <button
                  type="submit"
                  className="w-[150px] mt-8 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                  Next
                </button>
              </form>
            </>
          )}
          {step === 2 && <EmailVerification onVerify={handleVerify} />}
          {step === 3 && <AccountCompletion onNext={handleNext} />}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
