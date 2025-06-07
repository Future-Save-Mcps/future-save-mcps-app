import React, { useState } from "react";
import { useForm } from "react-hook-form";
import FormFieldComp from "./form/FormFieldComp";
import { useApiPost } from "@/hooks/useApi";
import { useSearchParams } from "react-router-dom";

const ForgotPassword = ({ onNext }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { post } = useApiPost();

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const onSubmit = async (data) => {
    setErrorMsg("");
    setSuccessMsg("");
    // setLoading(true);

    try {

      const response = await post(`/auth/forgot-password?EmailAddress=${data.email}`);

      if (!response.success) {
        const error = await response.json();
        setErrorMsg(error.message || "Failed to process request");
      } else {
        setSuccessMsg("Reset instructions sent to your email");
        setSearchParams({
          step: 4,
          email: data.email,
        });

        onNext(); 
      }
    } catch (error) {
      setErrorMsg("An error occurred: " + error.message);
    } finally {
      setLoading(false);
    }
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
