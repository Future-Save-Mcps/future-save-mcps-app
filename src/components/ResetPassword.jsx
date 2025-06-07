import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import FormFieldComp from "./form/FormFieldComp";
import { useApiPost } from "@/hooks/useApi";

const ResetPassword = ({ onNext, onFailure }) => {
  const [searchParams] = useSearchParams();
  const emailAddress = searchParams.get("email");
  const otp = searchParams.get("otp");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { post } = useApiPost();

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const newPassword = watch("password");

  const onSubmit = async (data) => {
    try {
      const res = await post("/auth/reset-password", {
        emailAddress,
        otp,
        newPassword: data.password,
        confirmNewPassword: data.confirmPassword,
      });

      if (!res.success) {
        const errData = await res.json();
        setErrorMsg(errData.message || "Failed to reset password");
        if (onFailure) onFailure();  // notify parent
      } else {
        setSuccessMsg("Password reset successful");
        onNext(); // success
      }
    } catch (error) {
      setErrorMsg("An error occurred: " + error.message);
      if (onFailure) onFailure();
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
      <p className="text-gray-600 mb-14">Enter new password to reset password</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="gap-4 mb-6">
          <FormFieldComp
            label="New Password"
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
                value === newPassword || "Passwords do not match",
            }}
            errors={errors}
          />
        </div>


        <button
          type="submit"
          disabled={loading}
          className={`w-[150px] mt-8 bg-primary text-white py-2 px-4 rounded-lg transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Submitting..." : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
