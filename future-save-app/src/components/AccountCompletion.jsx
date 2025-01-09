import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormFieldComp from "./form/FormFieldComp";
import { useApiPost } from "../hooks/useApi";
import axios from "axios";
import FormButton from "./FormBtn";

const AccountCompletion = ({ onNext, userId }) => {
  const [banks, setBanks] = useState([]);
  const [bank, setBank] = useState({});
  const { post, isLoading } = useApiPost();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  // Fetch banks from Paystack API
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get("https://api.paystack.co/bank", {
          headers: {
            Authorization: `Bearer YOUR_PAYSTACK_SECRET_KEY`, // Replace with your Paystack secret key
          },
        });
        const bankOptions = response.data.data.map((bank) => ({
          label: bank.name,
          value: bank.code,
        }));
        setBanks(bankOptions);
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };
    fetchBanks();
  }, []);

  const onSubmit = async (data) => {
    const formData = {
      gender: data.gender,
      bvn: data.bvn,
      dateOfBirth: data.dateOfBirth,
      bankAccountNumber: data.accountNumber,
      accountName: data.accountName,
      bankName: bank.label,
      bankCode: bank.value,
    };

    console.log("Account Completion Data:", formData);

    const result = await post(`user/${userId}/complete-user-profile`, formData);
    if (result.success && result.data) {
      onNext();
    }
  };

  useEffect(() => {
    console.log(bank);
  }, [bank]);

  return (
    <div className="w-full mx-auto">
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
          <div>
            <FormFieldComp
              label="Bank Name"
              name="bankName"
              type="Bank"
              searchable={true}
              setValue={setValue}
              setBank={setBank}
              register={register}
              validation={{ required: "Bank name is required" }}
              options={banks}
              errors={errors}
            />
          </div>

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

        <FormButton
          type="submit"
          text="Next"
          isLoading={isLoading}
          disabled={isLoading}
        />
      </form>
    </div>
  );
};

export default AccountCompletion;
