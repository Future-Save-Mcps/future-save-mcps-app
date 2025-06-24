import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import FormFieldComp from "../form/FormFieldComp";
import { Controller, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import { useApiGet, useApiPatch, useApiPost } from "../../hooks/useApi";
import axios from "axios";
import FormButton from "../FormBtn";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95vw",
  bgcolor: "background.paper",
  border: "none",
  outline: "none",
  px: 4,
  maxWidth: "530px",
  borderRadius: "20px",
};

const BankAndWithdrawal = () => {
  const [open, setOpen] = useState(false);
  const [banks, setBanks] = useState([]);
  const [bank, setBank] = useState({});
  const { post } = useApiPost();
  const secretKey = import.meta.env.VITE_PAYSTACK_SECRET_KEY;
  const { data: userData, refetch } = useApiGet("user");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm();

  // Fetch banks from Paystack API
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get("https://api.paystack.co/bank", {
          headers: {
            Authorization: `Bearer ${secretKey}`,
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

  const accountNumber = watch("accountNumber");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const resolveAccount = async () => {
        if (accountNumber?.length === 10 && bank?.value) {
          try {
            const res = await axios.get(
              `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bank.value}`,
              {
                headers: {
                  Authorization: `Bearer ${secretKey}`,
                },
              }
            );

            const name = res.data?.data?.account_name;
            if (name) {
              setValue("accountName", name);
            } else {
              throw new Error("No name found");
            }
          } catch (err) {
            setValue("accountName", "");
            console.error("Error resolving:", err);
            alert("Failed to resolve account name");
          }
        }
      };

      resolveAccount();
    }, 600); // debounce for 600ms

    return () => clearTimeout(timeout);
  }, [accountNumber, bank?.value]);

  const handleOpen = () => {
    setOpen(true);
  };
  const { patch, isLoading } = useApiPatch();

  const handleClose = () => setOpen(false);

  const onSubmit = async (data) => {
    if (!data.accountName) {
      alert(
        "Unable to fetch account name. Please check your account number and bank."
      );
      return;
    }

    const formData = {
      bvn: data.bvn,
      userLoginPassword: data.password,
      accountNumber: data.accountNumber,
      accountName: data.accountName,
      bankName: bank.label,
      bankCode: bank.value,
    };

    const result = await patch(`user/bank-details`, formData);
    if (result.success && result.data) {
      handleClose(); // Close modal
      refetch(); // Refresh user data
    }
  };

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <div className="font-[600] text-[22px]">Bank & Withdrawal</div>
          <button onClick={handleOpen} className="border px-4 py-1 rounded-2xl">
            Update
          </button>
        </div>

        <div className="p-6 mt-8">
          <div className="flex justify-between flex-wrap gap-12">
            <div className="max-w-[150px] w-[90vw]">
              <h3 className="font-bold">BVN</h3>
              <p>{userData?.data?.bvn}</p>
            </div>

            <div className="max-w-[300px] w-fit">
              <h3 className="font-bold">Bank Name</h3>
              <p>{userData?.data?.bankName}</p>
            </div>

            <div className="max-w-[150px] w-[90vw]">
              <h3 className="font-bold">Account Number</h3>
              <p>{userData?.data?.bankAccountNumber}</p>
            </div>

            <div className="max-w-[300px] w-[90vw]">
              <h3 className="font-bold">Account Name</h3>
              <p>{userData?.data?.accountName}</p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" my-6  h-[100%] overflow-auto hide-scrollbar max-h-[80vh]"
          >
            <div className="flex justify-between mb-4 items-center">
              <h2 className="text-xl font-semibold ">
                Update Withdrawal Account
              </h2>
              <CloseIcon
                onClick={handleClose}
                sx={{
                  cursor: "pointer",
                  padding: "5px",
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  backgroundColor: "#F8F8FA",
                }}
              />
            </div>

            {/* First Name */}
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
            {/* Last Name */}
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

            {/* Account Number */}
            <Controller
              control={control}
              name="accountNumber"
              rules={{
                required: "Account number is required",
                pattern: {
                  value: /^\d{10}$/,
                  message: "Account number must be 10 digits",
                },
              }}
              render={({ field }) => (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#939393] mb-1">
                    Account Number
                  </label>
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter Account Number"
                    className="w-full px-2 py-3 rounded-lg border focus:outline-none"
                  />
                  {errors.accountNumber && (
                    <p className="text-red-500 mt-1 text-[12px]">
                      {errors.accountNumber.message}
                    </p>
                  )}
                </div>
              )}
            />

            <FormFieldComp
              label="Name of Account"
              name="accountName"
              type="text"
              register={register}
              validation={{ required: "Account name is required" }}
              placeholder="Enter Name of Account"
              errors={errors}
            />

            {/* Email */}
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

            {/* Submit Button */}
            <FormButton
              width="100%"
              type="submit"
              text="Update"
              isLoading={isLoading}
              disabled={isLoading}
            />
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default BankAndWithdrawal;
