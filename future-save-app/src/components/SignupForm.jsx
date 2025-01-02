import React from "react";
import { useForm } from "react-hook-form";
import FormFieldComp from "./form/FormFieldComp";
import EmailVerification from "./EmailVerification";
import { useState } from "react";
import AccountCompletion from "./AccountCompletion";
import { useNavigate } from "react-router-dom";
import { useApiPost } from "../hooks/useApi";
import FormButton from "./FormBtn";

const SignUpForm = () => {
  const [step, setStep] = useState(1);
  const { post, isLoading, isError, error, data } = useApiPost();

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
    handleNext();
    // Proceed to the next step or dashboard
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    const result = await post("auth/register", {
      firstName: data.firstName,
      lastName: data.lastName,
      emailAddress: data.email,
      password: data.password,
      role: "user",
      phoneNumber: data.phoneNumber,
    });

    if (
      result !== "NETWORK_ERROR" &&
      result !== "FETCH_ERROR" &&
      result !== "AUTH_ERROR" &&
      result !== "PERMISSION_ERROR" &&
      result !== "SERVER_ERROR" &&
      result !== "UNKNOWN_ERROR"
    ) {
      console.log("Registration result:", result);
      handleNext();
    }
  };

  const password = watch("password");

  return (
    <div className="flex w-[100%] ">
      <div className=" m-auto flex-1 mt-10 px-[10%]">
        <div>
          {step === 1 && (
            <>
              <h2 className="text-3xl font-semibold mb-4">Sign Up</h2>
              <p className="text-sm mb-[50px]">
                Already have an account?{" "}
                <a href="/login" className="text-blue-500 font-medium">
                  Login
                </a>
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormFieldComp
                    label="First Name"
                    name="firstName"
                    placeholder="First Name"
                    register={register}
                    validation={{ required: "First Name is required" }}
                    errors={errors}
                  />
                  <FormFieldComp
                    label="Last Name"
                    name="lastName"
                    placeholder="Last Name"
                    register={register}
                    validation={{ required: "Last Name is required" }}
                    errors={errors}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <FormFieldComp
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Phone Number"
                    register={register}
                    validation={{
                      required: "Phone Number is required",
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: "Phone number must be between 10-15 digits",
                      },
                    }}
                    errors={errors}
                  />
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
                <FormFieldComp
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  register={register}
                  validation={{
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  }}
                  errors={errors}
                />

                <FormButton
                  type="submit"
                  text="Next"
                  isLoading={isLoading}
                  disabled={isLoading}
                />
              </form>
            </>
          )}
          {step === 2 && (
            <EmailVerification onVerify={handleVerify} agreement={true} />
          )}
          {step === 3 && <AccountCompletion onNext={handleNext} />}
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
