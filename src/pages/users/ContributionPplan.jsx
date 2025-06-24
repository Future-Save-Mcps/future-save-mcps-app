import React, { useEffect, useRef, useState } from "react";
import OngoingCompletedCard from "../../components/Cards/OngoingCompletedCard";
import Warning from "../../components/Cards/Warning";
import Bg from "../../assets/cardBd.svg";
import WarningImg from "../../assets/warning.svg";
import WithdrawIcon from "../../assets/withdraw.svg";

import NotFound from "../../assets/notfound.svg";
import DeactivateWarnImg from "../../assets/deactivateimg.svg";
import { Drawer } from "@mui/material";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import SendImg from "../../assets/send.svg";
import { Box, Modal, Typography } from "@mui/material";
import LoanTabs from "../../components/LoanTabs";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import FormFieldComp from "../../components/form/FormFieldComp";
import { useApiGet, useApiPost } from "../../hooks/useApi";
import FormButton from "../../components/FormBtn";
import { formatDate } from "../../utils/formatDate";
import { calculatePercentage } from "../../utils/calculatePercentage";
import { generateWeekOptions } from "../../utils/weeksOptionGenerator";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import { getUserData } from "../../utils/getUserData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReusablePaystackButton from "@/components/paystack/PaystackButton";
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

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#65C466",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const ContributionPplan = () => {
  const userData = getUserData();
  const [state, setState] = useState(false);
  const [paymentData, setPaymentData] = useState({
    reference: null,
    amount: null,
  });
  const paystackBtnRef = useRef(null);

  const [planId, setPlanId] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const {
    data,
    refetch,
    isLoading: isLoadingData,
  } = useApiGet("user/dashboard");
  const navigate = useNavigate();

  const {
    data: contributionPlan,
    isLoading: isLoadingContributionPlan,
    isFetching,
    refetch: refetchContributionPlan,
  } = useApiGet(`savingsplan?PlanId=${planId}`);

  const {
    data: activities,
    isLoading: isActivities,
    // isFetching,
    refetch: refetchActivities,
  } = useApiGet(
    `savingsplan/activities-and-history-tracking?SavingsPlanId=${planId}`
  );

  const {
    data: contribution,
    isLoading: isLoadingContribution,
    refetch: refetchContribution,
  } = useApiGet(`savingsplan/all?PageNumber=1&PageSize=10000`);

  const { post, isLoading } = useApiPost();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  // Watch the selected savings plan
  const savingsPlan = watch("savingsPlan", "25");
  const paymentType = watch("paymentType", "CurrentWeekPayment");
  const numberOfWeeks = watch("Weeks", "");
  // Default to '25' weeks plan

  const onSubmit = async (data) => {
    const formData = {
      savingsPlanName: data.nameOfSavings,
      savingsPlan: data.savingsPlan,
      weeklyAmount: data.weeklyAmount,
      targetAmount: data.targetAmount,
      startDate: data.startDate,
    };

    const result = await post(`savingsplan`, formData);
    if (result.success && result.data) {
      refetchContribution();
      refetch();
      handleClose();
    }
  };

  const onSubmitPayment = async (data) => {
    const formData = {
      savingsPlanId: planId,
      amount: data.weeklyAmount,
      paymentType: data.paymentType,
    };

    const result = await post(`savingsplan/add-savings-fund`, formData);

    if (result.success && result.data) {
      refetchContributionPlan();
      refetch();

      const paymentReference = result?.data?.transactionReference;

      setPaymentData({
        reference: paymentReference,
        amount: data.weeklyAmount,
      });
      setFormSubmitted(true);
      // Slight delay to ensure the Paystack button is mounted before clicking
      setTimeout(() => {
        paystackBtnRef.current?.click();
      }, 200);
    }
  };
  const onSubmitWithdrawal = async (data) => {
    const formData = {
      savingsPlanId: planId,
      amount: data.weeklyAmount,
      loginPassword: data.password,
    };

    // console.log(formData);

    const result = await post(`savingsplan/withdraw-savings-fund`, formData);
    if (result.success && result.data) {
      refetchContribution();
      refetchContributionPlan();
      refetch();
      handleClosePaymentModal();
    }
  };
  const onSubmitDeactivation = async (data) => {
    const formData = {
      savingsPlanId: planId,
      loginPassword: data.password,
    };

    // console.log(formData);

    const result = await post(`savingsplan/withdraw-deactivate-savings-fund`, formData);
    if (result.success && result.data) {
      refetchContribution();
      refetchContributionPlan();
      refetch();
      handleClosePaymentModal();
    }
  };
  const [open, setOpen] = useState(false);
  const [onChangeValueNumberOfWeeks, setOnChangeValueNumberOfWeeks] =
    useState("");
  const [onChangeValue, setOnChangeValue] = useState(5000);
  const [onChangeValuePaymentType, setOnChangeValuePaymentType] =
    useState("CurrentWeekPayment");
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    reset();
  };
  const handleSuccess = (reference) => {
    // setTimeout(() => {
    // handleClosePaymentModal();
    // }, 3000);
  };
  const [openDeactivateModal, setOpenDeactivateModal] = useState(false);

  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Ongoing");
  const [paymentModalType, setPaymentModalType] = useState(null);


  useEffect(() => {
    if (contribution) {
    }
  }, [activeTab, contribution]);

  const filteredPlans = contribution?.data?.items.filter((plan) =>
    activeTab === "Ongoing"
      ? plan.planStatus === "inProgress"
      : plan.planStatus === "completed"
  );

  const handleOpenPaymentModal = (type) => {
    setPaymentModalType(type);
    setOpenPaymentModal(true);
  };
  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
    setPaymentModalType(null);
  };

  const toggleDrawer =
    (open, id = null) =>
    (event) => {
      if (
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setPlanId(id);
      setState(open);
    };

  const weeklyAmount = watch("weeklyAmount", 0);
  const planWeeks = parseInt(savingsPlan || 0, 10);
  // Calculate targetAmount whenever weeklyAmount or savingsPlan changes
  useEffect(() => {
    const weekly = parseInt(onChangeValue || 0, 10);

    setValue("targetAmount", weekly * planWeeks);
  }, [savingsPlan, onChangeValue]);

  useEffect(() => {
    if (paymentType === "CurrentWeekPayment") {
      setValue("Weeks", 1);
    }
    // setValue("targetAmount", onChangeValuePaymentType);
  }, [paymentType, onChangeValuePaymentType]);

  useEffect(() => {
    setValue("weeklyAmount", 5000 * numberOfWeeks);
  }, [numberOfWeeks, onChangeValueNumberOfWeeks]);

  return (
    <>
      <div>
        <div className="flex gap-6 mb-8">
          <div className="min-h-[150px] border gap-4 p-4 flex flex-col justify-center items-center flex-1 rounded-2xl">
            <div className="font-[400] text-center text-[16px] text-primary">
              Total Savings{" "}
            </div>
            <div className="font-[700] text-center text-[28px]">
              {isLoadingData ? (
                <Spinner />
              ) : (
                <>₦ {data?.data?.userDashboard?.totalSavingsBalance}</>
              )}
            </div>
          </div>
          <div className="min-h-[150px] bg-[#041F620D] gap-4 p-4 flex flex-col justify-center items-center flex-1 rounded-2xl">
            <div className="font-[400] text-center text-[16px] text-primary">
              Total Savings Dividends
            </div>
            <div className="font-[700] text-center text-[28px]">
              {isLoadingData ? (
                <Spinner />
              ) : (
                <>₦ {data?.data?.userDashboard?.totalDividendBalance}</>
              )}
            </div>
          </div>
        </div>
        <div className=" flex items-center  mb-4 justify-between ">
          <h2 className="text-[24px] font-[600] ">My Contribution Plans</h2>
          <button
            onClick={handleOpen}
            className="bg-primary text-[18px] text-white w-fit px-6 py-2 rounded-lg"
          >
            {" "}
            <span className="font-[600] text-[20px] mr-[15px]">+</span> Create
            Plan
          </button>
        </div>
        <div className=" max-w-[550px] border min-h-[500px] p-4 rounded-2xl ">
          <div className="flex border-b ">
            <button
              onClick={() => setActiveTab("Ongoing")}
              className={`flex-1 text-[20px] font-[600] p-4 ${
                activeTab === "Ongoing"
                  ? " border-b-2 border-primary"
                  : "text-[#717171]"
              }`}
            >
              {" "}
              Ongoing{" "}
            </button>{" "}
            <button
              onClick={() => setActiveTab("Completed")}
              className={`flex-1 text-[20px] font-[600] p-4 ${
                activeTab === "Completed"
                  ? " border-b-2 border-primary"
                  : "text-[#717171]"
              }`}
            >
              {" "}
              Completed{" "}
            </button>
          </div>
          <div className="">
            {isLoadingContribution ? (
              <Spinner />
            ) : (
              filteredPlans?.map((plan) => (
                <OngoingCompletedCard
                  key={plan.planId}
                  id={plan.planId}
                  cardTitle={plan.planName}
                  contrubutionBalance={`₦ ${plan.currentBalance}`}
                  contributionWeekPlan={`${plan.durationInWeeks} weeks Plan`}
                  status={plan.planStatus}
                  remainingDays={` ${plan.daysRemaining} days remaining`}
                  onClick={toggleDrawer(true, plan.planId)}
                  percentage={
                    plan.planStatus === "completed"
                      ? 100
                      : calculatePercentage(
                          plan.currentBalance,
                          plan.targetAmount
                        )
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={state}>
        <div className=" w-[100vw] max-w-[700px]">
          <div className=" flex  p-4  bg-white sticky top-0 justify-between mb-8 items-center ">
            <h2 className="text-[24px] font-[700]">Plan Details</h2>
            <CloseIcon
              onClick={toggleDrawer(false)}
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
          <div className="p-4">
            {isLoadingContributionPlan || isFetching ? (
              <Spinner />
            ) : (
              <>
                <OngoingCompletedCard
                  cardTitle={contributionPlan?.data?.planName}
                  contrubutionBalance={`₦ ${contributionPlan?.data?.currentBalance}`}
                  contributionWeekPlan={`${contributionPlan?.data?.durationInWeeks} weeks Plan`}
                  status={contributionPlan?.data?.planStatus}
                  remainingDays={` ${contributionPlan?.data?.daysRemaining} days remaining`}
                  onClick={toggleDrawer(true)}
                  percentage={
                    contributionPlan?.data?.planStatus === "completed"
                      ? 100
                      : contributionPlan?.data?.currentBalance < 1
                      ? 0
                      : (contributionPlan?.data?.currentBalance /
                          contributionPlan?.data?.targetAmount) *
                        100
                  }
                />

                <div className="flex justify-center gap-6 flex-wrap items-center">
                  {contributionPlan?.data?.planStatus === "completed" && (
                    <button
                      onClick={() => handleOpenPaymentModal("withdrawFund")}
                      className="flex my-6 justify-center items-center gap-4 px-6 py-3 rounded-xl text-[#fff] bg-primary "
                    >
                      {" "}
                      <img src={WithdrawIcon} /> Withdraw funds
                    </button>
                  )}

                  {contributionPlan?.data?.planStatus === "inProgress" && (
                    <>
                      <button
                        onClick={() => handleOpenPaymentModal("addFund")}
                        className="flex my-6 justify-center items-center gap-4 px-6 py-3 rounded-xl text-[#fff] bg-primary "
                      >
                        {" "}
                        <AddIcon
                          sx={{
                            color: "white",
                          }}
                        />{" "}
                        Make Repayment
                      </button>

                      <button
                        onClick={() => handleOpenPaymentModal("deactivatePlan")}
                        className="flex my-6 justify-center items-center gap-4 px-6 py-3 rounded-xl text-[#fff] bg-[#FB0300] "
                      >
                        {" "}
                        <CloseIcon
                          sx={{
                            color: "white",
                          }}
                        />{" "}
                        De-activate Plan
                      </button>
                    </>
                  )}
                </div>

                <div style={styles.card}>
                  <div style={styles.row}>
                    <div style={styles.column}>
                      <div className="w-fit m-auto">
                        <p>
                          <strong>Weekly Amount</strong>
                        </p>
                        <p>NGN {contributionPlan?.data?.weeklyAmount}</p>
                      </div>
                    </div>
                    <div style={styles.column}>
                      <div className="w-fit m-auto">
                        <p>
                          <strong>Target Amount</strong>
                        </p>
                        <p>NGN {contributionPlan?.data?.targetAmount}</p>
                      </div>
                    </div>
                    <div style={styles.column}>
                      <div className="w-fit m-auto">
                        <p>
                          <strong>Start Date</strong>
                        </p>
                        <p>{formatDate(contributionPlan?.data?.startDate)}</p>
                      </div>
                    </div>
                  </div>
                  <div style={styles.row}>
                    <div style={styles.column}>
                      <div className="w-fit m-auto">
                        <p>
                          <strong>End Date</strong>
                        </p>
                        <p> {formatDate(contributionPlan?.data?.endDate)}</p>
                      </div>
                    </div>
                    <div style={styles.column}>
                      <div className="w-fit m-auto">
                        <p>
                          <strong>Dividend</strong>
                        </p>
                        <p>NGN {contributionPlan?.data?.dividends}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <LoanTabs
                  transactions={activities?.data?.weeklyInflow}
                  activities={activities?.data?.activities}
                  totalWeek={contributionPlan?.data?.durationInWeeks}
                />
              </>
            )}
          </div>
        </div>
      </Drawer>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Create Contribution Plan</h2>
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

          <form
            className=" overflow-auto max-h-[80dvh]"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormFieldComp
              label="Name of savings"
              name="nameOfSavings"
              type="text"
              placeholder="Detty Easter"
              register={register}
              validation={{
                required: "Name of savings is required",
              }}
              errors={errors}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Savings Plan
              </label>
              <Controller
                name="savingsPlan"
                control={control}
                defaultValue="25"
                rules={{ required: "Savings plan is required" }}
                render={({ field }) => (
                  <div className="flex gap-4">
                    <label
                      className={`flex items-center space-x-2 flex-1 p-3 rounded-md border ${
                        field.value === "25"
                          ? "border-primary"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        {...field}
                        type="radio"
                        value="25"
                        checked={field.value === "25"}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span>25 weeks plan</span>
                    </label>
                    <label
                      className={`flex items-center space-x-2 flex-1 p-3 rounded-md border ${
                        field.value === "50"
                          ? "border-primary"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        {...field}
                        type="radio"
                        value="50"
                        checked={field.value === "50"}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span>50 weeks plan</span>
                    </label>
                  </div>
                )}
              />
              {errors.savingsPlan && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.savingsPlan.message}
                </p>
              )}
            </div>

            <FormFieldComp
              label="Weekly Amount (Min. of NGN 5000.00)"
              name="weeklyAmount"
              type="number"
              placeholder="5000"
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
              onchange={true}
              setOnChangeValue={setOnChangeValue}
              errors={errors}
            />

            <FormFieldComp
              readOnly={true}
              defaultValueAttachment={onChangeValue * planWeeks}
              setValue={setValue}
              label="Target Amount"
              name="targetAmount"
              type="number"
              placeholder="125000"
              register={register}
              validation={{
                required: "Target amount is required",
              }}
              errors={errors}
            />

            <Controller
              name="startDate"
              control={control}
              rules={{
                required: "Start date is required",
                validate: (value) => {
                  const selectedDate = new Date(value);
                  return (
                    selectedDate.getDay() === 1 || "Please select a Monday."
                  );
                },
              }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  filterDate={(date) => date.getDay() === 1} // Allow only Mondays
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select a Monday"
                  className="border border-gray-300 p-2 rounded-md"
                />
              )}
            />
            <div className="mb-4 f">
              <div className="lex items-center">
                <Controller
                  name="terms"
                  control={control}
                  defaultValue={false}
                  rules={{ required: "You must agree to the terms" }}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <IOSSwitch
                          sx={{
                            margin: "14px",
                          }}
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                      label={
                        <span
                          style={{
                            fontSize: "12px",
                          }}
                        >
                          I agree that If I deactivate the savings plan before
                          the due date, I forfeit 50% of my contributions.
                        </span>
                      }
                    />
                  )}
                />
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.terms.message}
                </p>
              )}
            </div>
            <FormButton
              type="submit"
              text="Create Plan"
              width="100%"
              isLoading={isLoading}
              disabled={isLoading}
            />
          </form>
        </Box>
      </Modal>

      <Modal
        key={openPaymentModal ? paymentModalType : "closed"}
        open={openPaymentModal}
        onClose={handleClosePaymentModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {paymentModalType === "addFund"
                ? "Add Fund"
                : paymentModalType === "withdrawFund"
                ? "Withdraw Funds"
                : paymentModalType === "deactivatePlan" // New condition added here
                ? "Deactivate Plan"
                : ""}
            </h2>
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

          {paymentModalType === "addFund" && (
            <div className="">
              <form
                className=" overflow-auto max-h-[80dvh]"
                onSubmit={handleSubmit(onSubmitPayment)}
              >
                <div className="mb-4">
                  <label className="block text-sm font-medium text-primary mb-2">
                    Payment Type
                  </label>
                  <Controller
                    name="paymentType"
                    control={control}
                    defaultValue="CurrentWeekPayment"
                    rules={{ required: "payment type is required" }}
                    render={({ field }) => (
                      <div className="flex gap-4">
                        <label
                          className={`flex items-center space-x-2 flex-1 p-3 rounded-md border ${
                            field.value === "CurrentWeekPayment"
                              ? "border-primary"
                              : "border-gray-300"
                          }`}
                        >
                          <input
                            {...field}
                            type="radio"
                            value="CurrentWeekPayment"
                            checked={field.value === "CurrentWeekPayment"}
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <span>This week payment</span>
                        </label>
                        <label
                          className={`flex items-center space-x-2 flex-1 p-3 rounded-md border ${
                            field.value === "AdvancePayment"
                              ? "border-primary"
                              : "border-gray-300"
                          }`}
                        >
                          <input
                            {...field}
                            type="radio"
                            value="AdvancePayment"
                            checked={field.value === "AdvancePayment"}
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                          />
                          <span>Advance Payment</span>
                        </label>
                      </div>
                    )}
                  />
                  {errors.paymentType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.paymentType.message}
                    </p>
                  )}
                </div>
                {paymentType === "AdvancePayment" && (
                  <FormFieldComp
                    label="Number of weeks (25 weeks Plan)"
                    name="Weeks"
                    type="select"
                    setValue={setValue}
                    register={register}
                    validation={{ required: "Number of weeks is required" }}
                    options={generateWeekOptions(25)}
                    errors={errors}
                  />
                )}

                <FormFieldComp
                  label={`Weekly Amount (Your weekly payment is NGN ${contributionPlan?.data?.weeklyAmount?.toLocaleString(
                    "en-NG",
                    { minimumFractionDigits: 2 }
                  )})`}
                  name="weeklyAmount"
                  type="number"
                  big
                  readOnly
                  placeholder="5000"
                  register={register}
                  defaultValueAttachment={
                    paymentType === "AdvancePayment" && numberOfWeeks
                      ? contributionPlan?.data?.weeklyAmount * numberOfWeeks
                      : contributionPlan?.data?.weeklyAmount
                  }
                  setValue={setValue}
                  validation={{
                    required: "Weekly amount is required",
                    min: {
                      value: 5000,
                      message: "Amount must be at least NGN 5000.00",
                    },
                  }}
                  errors={errors}
                />

                <div className="flex items-center gap-3 mt-4 mb-2">
                  <label
                    htmlFor="addFundsToggle"
                    className="text-sm font-medium text-primary"
                  >
                    Initiate Funds transfer
                  </label>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="addFundsToggle"
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleSubmit(onSubmitPayment)(); // manually submit the form
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer-focus:ring-2 peer-focus:ring-primary peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5"></div>
                  </label>
                </div>
              </form>
              {formSubmitted && paymentData?.reference && (
                <ReusablePaystackButton
                  afterClose={() => {
                    handleClosePaymentModal();
                    refetchContributionPlan();
                  }}
                  email={userData?.data?.email}
                  amount={
                    Number(paymentType === "advance" ? numberOfWeeks : 1) *
                    weeklyAmount
                  }
                  currency="NGN"
                  reference={paymentData.reference}
                  onSuccess={handleSuccess}
                  onClose={handleClosePaymentModal}
                  text="Make payment"
                  className="w-full py-2 px-4 mt-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00205C] hover:bg-[#001845] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00205C]"
                />
              )}
            </div>
          )}

          {paymentModalType === "withdrawFund" && (
            <form
              className=" overflow-auto max-h-[80dvh]"
              onSubmit={handleSubmit(onSubmitWithdrawal)}
            >
              <FormFieldComp
                label={`Total Balance ${contributionPlan?.data?.currentBalance}`}
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
          )}
          {paymentModalType === "deactivatePlan" && (
            <div className="flex flex-col gap-4 justify-center items-center">
              <img width={"40%"} src={DeactivateWarnImg} alt="" />
              <h2 className="text-2xl font-semibold">Warning!</h2>
              <p className="w-[70%] text-center text-[#313131] text-base font-semibold">
                Deactivating funds means that you will lose 50% of this savings
                balance.
              </p>
              <div className="flex  w-full justify-center gap-6">
                <button
                  onClick={() => navigate("/user/loan_management")}
                  className=" mt-6 flex-1 justify-center items-center gap-4 px-6 py-3 rounded-xl text-[#fff] bg-primary "
                >
                  Apply for loan
                </button>

                <button
                  onClick={() => setOpenDeactivateModal(true)}
                  className=" mt-6 flex-1 justify-center items-center gap-4 px-6 py-3 rounded-xl text-[#fff] bg-[#FB0300] "
                >
                  Deactivate
                </button>
              </div>
            </div>
          )}
        </Box>
      </Modal>
      <Modal
  open={openDeactivateModal}
  onClose={() => setOpenDeactivateModal(false)} // Close modal on close button click
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Confirm Deactivation</h2>
      <CloseIcon
        onClick={() => setOpenDeactivateModal(false)}  // Close modal on close button click
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

    {/* Modal Content: Confirmation */}
    <form
              className=" overflow-auto max-h-[80dvh]"
              onSubmit={handleSubmit(onSubmitDeactivation)}
            >
              

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

    </>
  );
};

const styles = {
  card: {
    margin: "20px auto",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  column: {
    flex: 1,
    padding: "auto",
    width: "fit-content",
    margin: "20px 10px",
  },
};

export default ContributionPplan;
