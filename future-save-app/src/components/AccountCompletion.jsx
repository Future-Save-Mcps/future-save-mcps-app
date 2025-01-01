import React from "react";
import { useForm } from "react-hook-form";
import FormFieldComp from "./form/FormFieldComp";

const AccountCompletion = ({ onNext }) => {
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
      <h2 className="text-2xl font-semibold mb-2">Account Completion</h2>
      <p className="text-gray-600 mb-14">
        Enter the following information to complete your account.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Gender */}
          <FormFieldComp
            label="Gender"
            name="gender"
            type="select"
            setValue={setValue} 
            register={register}
            validation={{ required: "Gender is required" }}
            options={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
            ]}
            errors={errors}
          />

          {/* Date of Birth */}
          <FormFieldComp
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            register={register}
            validation={{ required: "Date of birth is required" }}
            placeholder="DD/MM/YYYY"
            errors={errors}
          />

          {/* BVN */}
          <FormFieldComp
            label="BVN"
            name="bvn"
            type="text"
            register={register}
            validation={{
              required: "BVN is required",
              pattern: {
                value: /^\d{11}$/,
                message: "BVN must be 11 digits",
              },
            }}
            placeholder="Enter BVN"
            errors={errors}
          />

          {/* Bank Name */}
          <FormFieldComp
            label="Bank Name"
            name="bankName"
            type="select"
            setValue={setValue} 
            register={register}
            validation={{ required: "Bank name is required" }}
            options={[
              {
                label: "First Bank of Nigeria",
                value: "First Bank of Nigeria",
              },
              { label: "Access Bank", value: "Access Bank" },
              { label: "GTBank", value: "GTBank" },
              { label: "Zenith Bank", value: "Zenith Bank" },
            ]}
            errors={errors}
          />

          {/* Name of Account */}
          <FormFieldComp
            label="Name of Account"
            name="accountName"
            type="text"
            register={register}
            validation={{ required: "Account name is required" }}
            placeholder="Enter Name of Account"
            errors={errors}
          />

          {/* Account Number */}
          <FormFieldComp
            label="Account Number"
            name="accountNumber"
            type="text"
            register={register}
            validation={{
              required: "Account number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Account number must be 10 digits",
              },
            }}
            placeholder="Enter Account Number"
            errors={errors}
          />
        </div>

        {/* Next Button */}
        <button
          type="submit"
          className="w-[150px] mt-8 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default AccountCompletion;
