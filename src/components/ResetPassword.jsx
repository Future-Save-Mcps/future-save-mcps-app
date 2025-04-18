import React from "react";
import { useForm } from "react-hook-form";
import FormFieldComp from "./form/FormFieldComp";

const ResetPassword = ({ onNext }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Account Completion Data:", data);
    onNext(); // Proceed to the next step
  };

  return (
    <div className="w-full   mx-auto ">
      <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
      <p className="text-gray-600 mb-14">
        Enter new password to reset password
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="gap-4 mb-6">
          {/* Gender */}
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
                value === password || "Passwords do not match",
            }}
            errors={errors}
          />
        </div>

        {/* Next Button */}
        <button
          type="submit"
          className="w-[150px] mt-8 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
