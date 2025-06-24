import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import FormFieldComp from "./form/FormFieldComp";
import EmailVerification from "./EmailVerification";
import AccountCompletion from "./AccountCompletion";
import { useApiPost } from "../hooks/useApi";
import FormButton from "./FormBtn";
import { Button } from "./ui/button";
import logo from "../assets/logo.svg";

const SignUpForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [step, setStep] = useState(Number(searchParams.get("step")) || 1);
  const email = searchParams.get("email") || "";
  const userId = searchParams.get("userId") || null;

  const [selectedUserType, setSelectedUserType] = useState(null);

  const { post, isLoading } = useApiPost();
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 3) {
      if (selectedUserType === "Admin") {
        navigate("/", { replace: true }); 
      } else {
        navigate("/", { replace: true }); 
      }
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleVerify = async (otp) => {
    console.log("Entered OTP:", otp);
    const result = await post("auth/verify-user-email", {
      userId: userId,
      otp: otp,
    });

    if (result.success && result.data) {
      setSearchParams((prevParams) => {
        prevParams.set("step", "3");
        return prevParams;
      });
      if (selectedUserType === "Admin") {
        navigate("/", { replace: true }); 
      } else {
        handleNext(); 
      }
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");

    if (refCode) {
      setValue("referralCode", refCode);
    }
  }, [setValue]);

  const onSubmit = async (formData) => {

    const result = await post("auth/register", {
      firstName: formData.firstName,
      lastName: formData.lastName,
      emailAddress: formData.email,
      password: formData.password,
      role: selectedUserType,
      phoneNumber: formData.phoneNumber,
      referralCode: formData.referralCode,
    });

    if (result.success && result.data) {
      setSearchParams({
        step: 2,
        email: formData.email,
        userId: result.data.id,
      });
      setStep(2);
    }
  };

  const password = watch("password");

  return (
    <div className="flex w-[100%]">
      <div className="m-auto flex-1 mt-10 px-[10%]">
        <div className="bg-white flex justify-center p-2 rounded-xl font-bold text-xl my-6">
          <img src={logo} alt="Logo" />
        </div>
        <div>
          {step === 1 && (
            <>
              <h2 className="text-3xl font-semibold mb-4">Sign Up</h2>
              <p className="text-sm mb-[50px]">
                Already have an account?{" "}
                <a href="/" className="text-blue-500 font-medium">
                  Login
                </a>
              </p>

              {!selectedUserType && (
                <div className="flex flex-wrap gap-6">
                  <Button
                    onClick={() => setSelectedUserType("Admin")}
                    className="bg-white flex-1 text-2xl border min-h-[200px] rounded-2xl hover:bg-[#dce9f7]  border-primary p-8"
                  >
                    Sign Up as an Admin
                  </Button>
                  <Button
                    onClick={() => setSelectedUserType("User")}
                    className="bg-white flex-1 text-2xl border min-h-[200px] rounded-2xl hover:bg-[#dce9f7]  border-primary p-8"
                  >
                    Sign Up as a User
                  </Button>
                </div>
              )}

              {selectedUserType && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <input type="hidden" {...register("referralCode")} />

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
              )}
            </>
          )}
          {step === 2 && (
            <EmailVerification
              onVerify={handleVerify}
              email={email} // Pass the email
            />
          )}
          {step === 3 && (
            <AccountCompletion onNext={handleNext} userId={userId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
