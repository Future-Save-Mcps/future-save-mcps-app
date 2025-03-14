import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import back from "../../assets/back.svg";
import { useApiGet, useApiPost } from "@/hooks/useApi";
import empty from "../../assets/empty.svg";
import FormButton from "@/components/FormBtn";
import { Box, Drawer, FormControlLabel, Modal, Switch } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Controller, useForm } from "react-hook-form";
import FormFieldComp from "@/components/form/FormFieldComp";
import { styled } from "@mui/material/styles";
import { getUserData } from "@/utils/getUserData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Spinner from "@/components/Spinner";
import { generateWeekOptions } from "@/utils/weeksOptionGenerator";
import OngoingCompletedCard from "@/components/Cards/OngoingCompletedCard";
import { formatCurrency } from "@/utils/currencyFormatter";
import LoanTabs from "@/components/LoanTabs";

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

const UserDetails = () => {
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

  const savingsPlan = watch("savingsPlan", "25");
  const paymentType = watch("paymentType", "CurrentWeekPayment");
  const numberOfWeeks = watch("Weeks", "");
  const [state, setState] = useState(false);
  const [planId, setPlanId] = useState(null);
  const [loanId, setLoanId] = useState(null);

  const [open, setOpen] = useState(false);
  const { state: user } = useLocation();
  const [activeTab, setActiveTab] = useState("savings");
  const [onChangeValueNumberOfWeeks, setOnChangeValueNumberOfWeeks] =
    useState("");
  const [onChangeValue, setOnChangeValue] = useState(5000);
  const [onChangeValuePaymentType, setOnChangeValuePaymentType] =
    useState("CurrentWeekPayment");
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [planActiveTab, setPlanActiveTab] = useState("Ongoing");
  const [paymentModalType, setPaymentModalType] = useState(null);

  const userData = getUserData();

  const navigate = useNavigate();

  const {
    data: contributionPlan,
    isLoading: isLoadingContributionPlan,
    isFetching,

    refetch: refetchContributionPlan,
  } = useApiGet(planId ? `savingsplan?PlanId=${planId}` : null, {
    enabled: false, // 🚀 Prevent fetching on page mount
  });

  // 🚀 Fetch loan details ONLY when `loanId` is set
  const {
    data: loanPlan,
    isLoading: isLoadingLoanPlan ,
    // isFetching,

    refetch: refetchLoanPlan,
  } = useApiGet(loanId ? `loan?LoanId=${loanId}` : null, {
    enabled: false, // 🚀 Prevent fetching on page mount
  });

  const {
    data: loan,
    isLoading: isLoadingLoan,
    refetch: refetchLoan,
  } = useApiGet(`admin/user-details?memberUserId=${user}`);
  console.log(loan);
  if (!user) {
    return <p>User not found.</p>;
  }
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    reset();
  };
  const onSubmit = async (data) => {
    const formData = {
      userId: user,
      savingsPlanName: data.nameOfSavings,
      savingsPlan: data.savingsPlan,
      weeklyAmount: data.weeklyAmount,
      targetAmount: data.targetAmount,
      startDate: data.startDate,
    };

    const result = await post(`admin/savings-plan-by-admin`, formData);
    if (result.success && result.data) {
      // refetchContribution();
      refetch();
      handleClose();
    }
  };
  const handleOpenPaymentModal = (type) => {
    setPaymentModalType(type);
    setOpenPaymentModal(true);
  };
  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
    setPaymentModalType(null);
  };
  const onSubmitPayment = async (data) => {
    console.log(data);

    const formData = {
      savingsPlanId: loanId,
      amount: data.weeklyAmount,
      paymentType: data.paymentType,
      offlinePaymentType: "",
    };

    const response = await post(`admin/make-offline-payment`, formData);
    if (response.success && result.data) {
      // refetchContribution();
      refetch();
      handleClose();
    }
  };

  const toggleDrawer = (open, id = null, type = "savings") => () => {
    if (type === "savings") {
      setPlanId(id);
      setLoanId(null);
      refetchContributionPlan(); // 🚀 Fetch savings data only when opening
    } else {
      setLoanId(id);
      setPlanId(null);
      refetchLoanPlan(); // 🚀 Fetch loan data only when opening
    }
    setState(open);
  };
  // Refetch data when planId or loanId changes
  useEffect(() => {
    if (planId) {
      refetchContributionPlan();
    }
  }, [planId]);

  useEffect(() => {
    if (loanId) {
      refetchLoanPlan();
    }
  }, [loanId]);
  const weeklyAmount = watch("weeklyAmount", 0);
  const planWeeks = parseInt(savingsPlan || 0, 10);
  // Calculate targetAmount whenever weeklyAmount or savingsPlan changes
  useEffect(() => {
    const weekly = parseInt(onChangeValue || 0, 10);

    setValue("targetAmount", weekly * planWeeks);
  }, [savingsPlan, onChangeValue]);

  useEffect(() => {
    console.log(paymentType === "AdvancePayment");
    if (paymentType === "CurrentWeekPayment") {
      setValue("Weeks", 1);
    }
    // setValue("targetAmount", onChangeValuePaymentType);
  }, [paymentType, onChangeValuePaymentType]);

  useEffect(() => {
    console.log(onChangeValueNumberOfWeeks);

    setValue("weeklyAmount", 5000 * numberOfWeeks);
  }, [numberOfWeeks, onChangeValueNumberOfWeeks]);

  const IOSSwitch = styled((props) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
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

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mt-4">User Management</h1>
      <div className="flex items-center justify-between w-full mt-4">
        {/* Back Button */}
        <button className="flex items-center text-[#313131] text-lg font-medium">
          <img
            onClick={() => navigate(-1)}
            src={back}
            alt="Back"
            className="mr-2"
          />
          User Details
        </button>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleOpen}
            className="bg-[#041F62] text-white px-4 py-2 rounded"
          >
            Create Savings Plan
          </button>
          <button className="bg-[#FB0300] text-white px-4 py-2 rounded">
            Deactivate Account
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* Personal Info */}
        <div className="border p-4 rounded-lg ">
          <h2 className="font-semibold text-lg mb-2">
            Personal & Contact Information
          </h2>
          <div className="space-y-4">
            <p>
              <strong>First Name:</strong>{" "}
              {loan?.data?.userInformation?.firstName}
            </p>
            <p>
              <strong>Last Name:</strong>{" "}
              {loan?.data?.userInformation?.lastName}
            </p>
            <p>
              <strong>Gender:</strong> {loan?.data?.userInformation?.gender}
            </p>
            <p>
              <strong>Email:</strong> {loan?.data?.userInformation?.email}
            </p>
            <p>
              <strong>Phone Number:</strong>{" "}
              {loan?.data?.userInformation?.phoneNumber}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {loan?.data?.userInformation?.dateOfBirth}
            </p>
          </div>
        </div>

        {/* Bank Info */}
        <div className="border p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">
            Bank & Account Information
          </h2>
          <div className="space-y-4">
            <p>
              <strong>Bank:</strong>{" "}
              {loan?.data?.bankAccountInformation?.bankName}
            </p>
            <p>
              <strong>Account Number:</strong>{" "}
              {loan?.data?.bankAccountInformation?.bankAccountNumber}
            </p>
            <p>
              <strong>Account Name:</strong>{" "}
              {loan?.data?.bankAccountInformation?.accountName}
            </p>
            <p>
              <strong>BVN:</strong> {loan?.data?.bankAccountInformation?.bvn}
            </p>
            {/* <p><strong>Account Status:</strong> <span className="text-gray-500">● Inactive</span></p>
          <p><strong>Last Login:</strong> Nil</p> */}
          </div>
        </div>

        {/* Referral Info */}
        <div className="border p-4 rounded-lg col-span-2">
          <h2 className="font-semibold text-lg mb-2">Referral Information</h2>
          <div className="space-y-4">
            <p>
              <strong>Number of Referrals:</strong>{" "}
              {loan?.data?.referralInformation?.numbersOfReferral}
            </p>
            <p>
              <strong>Dividends Earned:</strong>{" "}
              {loan?.data?.referralInformation?.dividendEarned}
            </p>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b flex">
        <button
          className={`pb-2 px-6 font-semibold ${
            activeTab === "savings"
              ? "border-b-2 border-blue-600 text-black"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("savings")}
        >
          Savings Information
        </button>

        <button
          className={`pb-2 px-6 ${
            activeTab === "loan"
              ? "border-b-2 border-blue-600 text-black"
              : "text-gray-400"
          }`}
          onClick={() => setActiveTab("loan")}
        >
          Loan Information
        </button>
      </div>
      {/* Content Section */}
      <div className="mt-4">
        {activeTab === "savings" ? (
          loan?.data?.savingsInformation.length > 0 ? (
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Contribution Plans</th>
                  <th className="p-2 border">Target Amount</th>
                  <th className="p-2 border">Date Created</th>
                  <th className="p-2 border">Weekly Amount</th>
                  <th className="p-2 border">Account Status</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {loan?.data?.savingsInformation.map((plan, index) => (
                  <tr key={index} className="border">
                    <td className="p-2 border">{plan.savingsPlanType}</td>
                    <td className="p-2 border">
                      ₦ {plan.targetAmount.toLocaleString()}
                    </td>
                    <td className="p-2 border">{plan.dateCreated}</td>
                    <td className="p-2 border">
                      ₦ {plan.weeklyAmount.toLocaleString()}
                    </td>
                    <td className="p-2 border">
                      <span className="bg-orange-200 text-orange-600 px-2 py-1 rounded">
                        {plan.planStatus}
                      </span>
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={toggleDrawer(true, loan.loanId, "loan")}
                        className="bg-[#041F62] text-white px-4 py-1 rounded"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center mt-6">
              <img
                src={empty}
                alt="No Contribution plan yet"
                className="mx-auto w-20"
              />
              <p className="text-gray-600 mt-2">No Contribution Plan yet!</p>
            </div>
          )
        ) : loan?.data?.loanInformation.length > 0 ? (
          <table className="w-full  ">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Loan Type</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Date Created</th>
                <th className="p-2 border">Monthly Payment</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {loan?.data?.loanInformation.map((loan, index) => (
                <tr key={index} className="border">
                  <td className="p-2 border">{loan.loanPlanType}</td>
                  <td className="p-2 border">
                    ₦ {loan.targetAmount.toLocaleString()}
                  </td>
                  <td className="p-2 border">{loan.dateCreated}</td>
                  <td className="p-2 border">
                    ₦ {loan.weeklyAmount.toLocaleString()}
                  </td>
                  <td className="p-2 border">
                    <span className="bg-orange-200 text-orange-600 px-2 py-1 rounded">
                      {loan.loanStatus}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={toggleDrawer(
                        true,
                        plan.savingsPlanId,
                        "savingsPlanType"
                      )}
                      className="bg-[#041F62] text-white px-4 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center mt-6">
            <img src={empty} alt="No Loans" className="mx-auto w-20" />
            <p className="text-gray-600 mt-2">No Loan Plan Found!</p>
          </div>
        )}
      </div>
      <Drawer anchor="right" open={state}>
        <div className=" w-[100vw] relative max-w-[700px]">
          <div className=" p-4  bg-white  sticky top-0 flex justify-between mb-8 items-center ">
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
            {isLoadingLoan || isFetching ? (
              <Spinner />
            ) : (
              <>
                <OngoingCompletedCard
                  cardTitle={contributionPlan?.data?.planName || "test plan"}
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

                <div className="flex justify-center flex-wrap gap-4 items-center">
                  <button
                    onClick={() => handleOpenPaymentModal("Approval")}
                    className="flex justify-center min-w-[200px] mt-4 items-center gap-4 px-6 py-3 rounded-xl text-[#fff] bg-primary "
                  >
                    <span className="text-3xl font-mono">+</span> Make Offline
                    Payment
                  </button>
                </div>

                <div className="max-w-4xl mx-auto p-6">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">
                      Personal Info
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                      <p className=" flex flex-col">
                        <strong>Name</strong>{" "}
                        {loan?.data?.userInformation?.firstName}
                      </p>
                      <p className=" flex flex-col">
                        <strong>Email</strong>{" "}
                        {loan?.data?.userInformation?.email}{" "}
                      </p>
                      <p className=" flex flex-col">
                        <strong>Phone No</strong>{" "}
                        {loan?.data?.userInformation?.phoneNumber}{" "}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Plan Info</h2>
                    <div className="grid grid-cols-3 gap-4">
                      <p className=" flex flex-col">
                        <strong>Weekly Repayment</strong>{" "}
                        {formatCurrency(contributionPlan?.data?.weeklyAmount)}
                      </p>
                      <p className=" flex flex-col">
                        <strong>Target Amount</strong>
                        {formatCurrency(contributionPlan?.data?.targetAmount)}
                      </p>
                      <p className=" flex flex-col">
                        <strong>Start Date</strong>{" "}
                        {contributionPlan?.data?.startDate}
                      </p>
                      <p className=" flex flex-col">
                        <strong>End Date</strong>{" "}
                        {contributionPlan?.data?.endDate}
                      </p>
                      <p className=" flex flex-col">
                        <strong>Dividend</strong>{" "}
                        {formatCurrency(contributionPlan?.data?.dividends)}
                      </p>
                    </div>
                  </div>
                </div>

                <LoanTabs activities={contributionPlan?.data?.activities} />
              </>
            )}
          </div>
        </div>
      </Drawer>

      <Modal
        open={open}
        onClose={handleClose}
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
        open={openPaymentModal}
        onClose={handleClosePaymentModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Offline Payment</h2>
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
            onSubmit={handleSubmit(onSubmitPayment)}
          >
            <FormFieldComp
              label="Offline Payment Type"
              name="Type"
              type="select"
              setValue={setValue}
              register={register}
              validation={{ required: "Paymemt Type is required" }}
              options={generateWeekOptions(25)}
              errors={errors}
            />
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
                      <span>Advance Payment </span>
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
              label={`Weekly Amount (Your weekly payment is NGN 5000.00)`}
              name="weeklyAmount"
              type="number"
              big
              readOnly
              placeholder="5000"
              register={register}
              defaultValueAttachment={
                numberOfWeeks === ""
                  ? 5000
                  : paymentType === "CurrentWeekPayment"
                  ? 5000
                  : 5000 * numberOfWeeks
              }
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

            <FormButton
              width="100%"
              type="submit"
              text="Make payment"
              isLoading={isLoading}
              disabled={isLoading}
            />
          </form>

          {/* <div className="flex justify-center items-center mb-4">
            <h2 className="text-xl font-semibold">
              Loan {modalType} Confirmation
            </h2>
          </div>

          <div className="">
            <p className="text-[#B0B0B0] my-4 text-center">
              Are you sure you want to{" "}
              {modalType === "Approval" ? "approve" : "reject"} this loan?
            </p>

            <div className="flex  gap-4 ">
              <button
                onClick={handleClose}
                className="flex my-6 justify-center flex-1 p-[10px] min-w-[150px] items-center   rounded-md text-[#000] bg-[#F8F8FA] "
              >
                {" "}
                No, I’m not
              </button>

              {modalType === "Approval" ? (
                <button className="flex my-6 justify-center flex-1 p-[10px] min-w-[150px] items-center   rounded-md text-[#fff] bg-[#041F62] ">
                  {" "}
                  Yes, I am
                </button>
              ) : (
                <button className="flex my-6 justify-center flex-1 p-[10px] min-w-[150px] items-center   rounded-md text-[#fff] bg-[#FB0300] ">
                  {" "}
                  Yes, I am
                </button>
              )}
            </div>
          </div> */}
        </Box>
      </Modal>
    </div>
  );
};

export default UserDetails;
