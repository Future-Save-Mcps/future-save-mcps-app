import React from "react";
import { useForm } from "react-hook-form";
import FormFieldComp from "./form/FormFieldComp";

const ForgotPassword = ({ onNext }) => {
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
      <h2 className="text-2xl font-semibold mb-2">Forgot Password</h2>
      <p className="text-gray-600 mb-14">
        Enter the email you used in creating an account
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="gap-4 mb-6">
          {/* Gender */}
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

export default ForgotPassword;
