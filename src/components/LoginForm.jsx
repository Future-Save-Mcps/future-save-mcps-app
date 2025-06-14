import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormFieldComp from "./form/FormFieldComp";
import EmailVerification from "./EmailVerification";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import { useApiLogin } from "../hooks/useApi";
import FormButton from "./FormBtn";
import axios from "axios";
import { baseUrl } from "../features/api/apiSlice";
import logo from '../assets/logo.svg';


const LoginForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [step, setStep] = useState(Number(searchParams.get("step")) || 1);
  const email = searchParams.get("email") || "";
  const userId = searchParams.get("userId") || null;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { login, verifyOtp, isInitiateLoading, isCompleteLoading } =
    useApiLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const onSubmit = async (data) => {
    try {
      const result = await login({
        emailAddress: data.email,
        password: data.password,
      });
      if (result.success) {
        setSearchParams({
          step: 2,
          email: data.email,
          userId: result.data.userId,
        });
        handleNext();
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleVerifyLogin = async (otp) => {
    try {
      const result = await verifyOtp(watch("email"), otp);

      if (result.success) {
        setLoading(true);
        const { accessToken } = result.data;

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        axios
          .get(`${baseUrl}user`)
          .then((response) => {
            localStorage.setItem("userInfo", JSON.stringify(response.data));

            if (response.data.data.role === "Admin") {
              window.location.href = "/admin";
            } else {
              window.location.href = "/user";
            }
          })
          .catch((error) => {
            console.error("API Error:", error);
          });
        setLoading(false);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    }
  };

  const handleVerify = (otp) => {
    console.log("Entered OTP:", otp);
    // alert("Verification successful!");
    setSearchParams({
      step: 5,
      email: searchParams.get("email"),
      otp: otp,
    });

    setStep((prevStep) => prevStep + 1);
  };

  const handleResetPassword = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("otp");
      params.set("step", "1");
      return params;
    });
    setStep(1);
  };
  
  const goBackToOtpStep = () => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.delete("otp");
      params.set("step", "4");
      return params;
    });
    setStep(4);
  };

  const password = watch("password");

  return (
    <div className="flex w-[100%] ">
      <div className=" m-auto flex-1 mt-10 px-[10%]">
         <div className="bg-white flex justify-center p-2 rounded-xl font-bold text-xl my-6">
                <img src={logo} alt="Logo" />
              </div>
        <div>
          {step === 1 && (
            <>
              <h2 className="text-3xl font-semibold mb-4">Login</h2>
              <p className="text-sm mb-[20px]">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-primary ml-2  font-semibold"
                >
                  Sign Up
                </a>
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid   gap-4 mb-2">
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

                <p className="text- font-semibold mb-[10px] flex  justify-between">
                  <span></span>
                  <p
                    onClick={() => setStep(3)}
                    className="text-primary font-semibold"
                  >
                    Forgot Password?
                  </p>
                </p>

                <FormButton
                  type="submit"
                  text="Next"
                  // width="100%"
                  isLoading={isInitiateLoading}
                  disabled={isInitiateLoading}
                />
              </form>
            </>
          )}
          {step === 2 && (
            <EmailVerification
              userId={userId}
              email={email}
              onVerify={handleVerifyLogin}
              isLoading={isCompleteLoading || loading}
            />
          )}
          {step === 3 && <ForgotPassword onNext={handleNext} />}
          {step === 4 && <EmailVerification onVerify={handleVerify} />}
          {step === 5 && <ResetPassword onNext={handleResetPassword} onFailure={goBackToOtpStep} />}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
