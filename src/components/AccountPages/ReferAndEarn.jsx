import React, { useState } from "react";
import Bg from "../../assets/cardBd.svg";
import Copy from "../../assets/copy.svg";
import Upload from "../../assets/withdrawicon.svg";
import { useApiGet, useApiPost } from "@/hooks/useApi";
import { toast } from "react-toastify";
import { ContributionIcon } from "../icons/Icons";
import formatTimeAgo from "@/utils/formatTimeAgo";
import FormFieldComp from "../form/FormFieldComp";
import FormButton from "../FormBtn";
import { Box, Modal } from "@mui/material";
import { useForm } from "react-hook-form";
import { getUserData } from "@/utils/getUserData";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95vw",
  bgcolor: "white",
  border: "none",
  outline: "none",
  p: 3,
  maxWidth: "500px",
  borderRadius: "20px",
};

const ReferAndEarn = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const userData = getUserData();
  const { post, isLoading } = useApiPost();

  const token = localStorage.getItem("accessToken");
  console.log(token);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [paymentModalType, setPaymentModalType] = useState(null);

  const {
    data: dashboardData,
    isLoading: isLoadingDashboardData,
    refetch: refetchDashboardData,
    isFetching: isFerchingDashboardData,
  } = useApiGet("user/referral-dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const handleOpenPaymentModal = (type) => {
    setPaymentModalType(type);
    setOpenPaymentModal(true);
  };
  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
    setPaymentModalType(null);
  };

  const onSubmitWithdrawal = async (data) => {
    const formData = {
      amount: data.weeklyAmount,
      loginPassword: data.password,
    };

    // console.log(formData);

    const result = await post(`user/withdraw-referral-fund`, formData);
    if (result.success && result.data) {
      refetchDashboardData();
      handleClosePaymentModal();
    }
  };

  console.log(dashboardData);
  const referralLink = `https://app.futuresavemcps.com/register?ref=${dashboardData?.data?.referralCode}`;
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="font-[600] text-[22px]">Refer and Earn</div>
      </div>
      <div
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundSize: "contain",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
        className="min-h-[200px] border bg-[#171717] gap-4 p-4 flex flex-col justify-center items-center flex-1 rounded-2xl"
      >
        <div className="font-[700] text-center text-[28px] text-[#fff] ">
          Balance
        </div>
        <div className="font-[700] text-center text-[32px] text-[#fff]">
          {dashboardData?.data?.referralTotalAmountEarned}
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(referralLink);
            toast.success("Referral link copied!");
          }}
          className="   text-[18px] font-[600] text-[#fff] bg-[#FFFFFF1F] py-2 w-[40%] flex items-center justify-center rounded-lg"
        >
          <span className="px-2">
            <img src={Copy} alt="copy" />
          </span>
          Copy Referral Link
        </button>
      </div>
      <div className="flex justify-center my-6">
        <button
          onClick={handleOpenPaymentModal}
          className="text-[18px] font-[600] text-[#fff] bg-[#041F62] py-4 w-[30%] flex items-center justify-center rounded-lg"
        >
          <span className="px-2">
            <img src={Upload} alt="upload" />
          </span>
          Withdraw funds
        </button>
      </div>
      <div className="">
        <div className="font-[600] text-[22px]">Recent Activities</div>
        <div className="mt-4 space-y-4">
          {dashboardData?.data?.activities
            ?.slice()
            .reverse()
            .map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-900 text-white">
                  <ContributionIcon color="white" />
                </div>
                <div>
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
      <Modal
        open={openPaymentModal}
        onClose={handleClosePaymentModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">"Withdraw Funds"</h2>
            <CloseIcon
              onClick={handleClosePaymentModal}
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

          <form
            className=" overflow-auto max-h-[80dvh]"
            onSubmit={handleSubmit(onSubmitWithdrawal)}
          >
            <FormFieldComp
              label={`Total Balance ${dashboardData?.data?.referralTotalAmountEarned}`}
              name="weeklyAmount"
              type="number"
              big
              placeholder="₦ 1000"
              register={register}
              defaultValueAttachment={5000}
              setValue={setValue}
              validation={{
                required: "Weekly amount is required",
                min: {
                  value: 5000,
                  message: "Amount must be at least NGN 5000.00",
                },
              }}
              // onchange={true}
              // setOnChangeValue={setOnChangeValuePaymentType}
              errors={errors}
            />

            <div className="my-6 ">
              <label className="block text-sm font-medium text-[#939393] mb-1">
                Withdrawal Account
              </label>
              <div
                style={{
                  backgroundImage: `url(${Bg})`,
                  backgroundColor: "#72109D",
                  backgroundSize: "cover",
                  backgroundRepeat: "repeat",
                  backgroundPosition: "center",
                }}
                className=" bg-[#72109D] rounded-2xl p-6 flex flex-col justify-center items-center gap-1 "
              >
                <div className="font-bold text-xl text-white">
                  {userData?.data?.bankName}
                </div>
                <div className="font-bold text-xl text-white">
                  {userData?.data?.bankAccountNumber}
                </div>
                <div className="font-bold text-base text-white">
                  {`(${userData?.data?.accountName})`}
                </div>
              </div>
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

            <FormButton
              width="100%"
              type="submit"
              text="Withdraw Funds"
              isLoading={isLoading}
              disabled={isLoading}
            />
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ReferAndEarn;
