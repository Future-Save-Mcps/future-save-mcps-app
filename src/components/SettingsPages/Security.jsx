import React from "react";
import FormFieldComp from "../form/FormFieldComp";
import { useForm } from "react-hook-form";
import FormButton from "../FormBtn";

const Security = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  return (
    <div>
      <div className="font-[600] text-[22px]">Security Settings</div>
      <div className="  mt-10 w-[70%]">
        <form action="">
          <div className="grid   gap-4">
            <FormFieldComp
              label="Current Password"
              name="password"
              type="password"
              placeholder="current password"
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
          </div>
          <FormFieldComp
              label="New Password"
              name="password"
              type="password"
              placeholder="new password"
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
              name="password"
              type="password"
              placeholder="confirm password"
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

            <div className="">
            <button 
            className="w-full bg-[#041F62] rounded-lg py-4 text-white mt-4 text-2xl"
            type="submit"
            >Update</button>
            </div>
            
        </form>
      </div>
    </div>
  );
};

export default Security;
