// import React from 'react'

// const SavingsManagement = () => {
//   return (
//     <div>SavingsManagement</div>
//   )
// }

// export default SavingsManagement

import AdminTableComponent from "@/components/AdminTableComponent";
import { Box, Drawer, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Spinner from "@/components/Spinner";
import OngoingCompletedCard from "@/components/Cards/OngoingCompletedCard";
import { useApiGet, useApiPost } from "@/hooks/useApi";
import { formatDate } from "@/utils/formatDate";
import LoanTabs from "@/components/LoanTabs";
import { formatCurrency } from "@/utils/currencyFormatter";
import SendImg from "../../assets/send.svg";
import Warning from "@/components/Cards/Warning";
import { Controller, useForm } from "react-hook-form";

import FormButton from "@/components/FormBtn";
import FormFieldComp from "@/components/form/FormFieldComp";
import { generateWeekOptions } from "@/utils/weeksOptionGenerator";
import { useNavigate, useSearchParams } from "react-router-dom";

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

const SavingsManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState(false);
  const [loanId, setLoanId] = useState(searchParams.get("id"));
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const { post, isLoading } = useApiPost();
  const [currentPage, setCurrentPage] = useState(1);

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

  const onSubmitPayment = async (data) => {
    console.log(data);

    const formData = {
      savingsPlanId: loanId,
      amount: data.weeklyAmount,
      paymentType: data.paymentType,
      offlinePaymentType: data.offlinePaymentType,
    };

    const result = await post(`admin/make-offline-payment`, formData);
    if (result.success && result.data) {
      refetchContributionPlan();
      handleClose();
    }
  };

  const offLinePaymentOptions = [
    { label: "Cash", value: "Cash" },
    { label: "Transfer", value: "Transfer" },
  ];
  useEffect(() => {
    if (loanId) {
      setState(true);
    }
  }, [loanId]);

  const toggleDrawer = (id) => {
    window.location.href = `/admin/savings_management?id=${id}`;
  };
  const {
    data: loan,
    isLoading: isLoadingLoan,
    refetch: refetchLoan,
  } = useApiGet(`admin/savings/all?PageNumber=${currentPage}&PageSize=${10}`);

  const {
    data: contributionPlan,
    isLoading: isLoadingContributionPlan,
    isFetching,
    refetch: refetchContributionPlan,
  } = useApiGet(`savingsplan?PlanId=${loanId}`);

  console.log("loanPlan", contributionPlan);
  const tableHeaders = [
    { label: "Name", value: "fullName" },
    { label: "Contribution Plans", value: "durationInWeeks" },
    { label: "Target Amount", value: "targetAmount" },
    { label: "Date Created", value: "startDate" },
    { label: "Weekly Amount", value: "weeklyAmount" },
    { label: "Account Status", value: "planStatus" },
    // { label: "Action", value: "action" },
  ];

  const tableData = loan?.data?.items?.map((item) => ({
    ...item,
    id: item.planId,
    startDate: formatDate(item.startDate),
    durationInWeeks: item.durationInWeeks + " Weeks",
    targetAmount: formatCurrency(item.targetAmount),
    weeklyAmount: formatCurrency(item.weeklyAmount),
    planStatus: (
      <span
        className={`px-3 py-1 flex w-fit items-center gap-2 rounded-2xl  ${
          item.planStatus === "completed"
            ? "bg-[#34C7591F]  text-[#34C759]"
            : item.planStatus === "Rejected"
            ? "bg-[#FB03001F]  text-[#FB0300]"
            : "bg-[#FF790C1F]  text-[#FF790C]"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            item.planStatus === "completed"
              ? "bg-[#34C759]"
              : item.planStatus === "Rejected"
              ? "bg-[#FB0300]"
              : "bg-[#FF790C]"
          }`}
        ></div>{" "}
        {item.planStatus}
      </span>
    ),
  }));

  const handleOpen = (type) => {
    setOpen(true);
    setModalType(type);
  };
  const handleClose = () => {
    setOpen(false);
    setModalType(null);
  };

  const handleSearch = (query, data) => {
    refetchLoan({ search: value, PageNumber: currentPage, PageSize: 10 });
  };

  const handleFilter = (filter, data) => {
    console.log("this is the filter");
  };
  const handlePageChange = (newPage) => setCurrentPage(newPage);

  return (
    <div>
      <AdminTableComponent
        headers={tableHeaders}
        data={tableData}
        onSearch={handleSearch}
        onFilter={handleFilter}
        view={toggleDrawer}
        loading={isLoadingLoan}
        searchKey="planName"
        totalCount={loan?.data?.totalCount || 0}
        pageSize={loan?.data?.pageSize || 10}
        currentPage={currentPage}
        onPageChange={handlePageChange}

      />

      <Drawer anchor="right" open={state}>
        <div className=" w-[100vw] relative max-w-[700px]">
          <div className=" p-4  bg-white  sticky top-0 flex justify-between mb-8 items-center ">
            <h2 className="text-[24px] font-[700]">Plan Details</h2>
            <CloseIcon
              onClick={() => navigate(-1)}
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
                  // onClick={toggleDrawer(true)}
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
                    onClick={() => handleOpen("Approval")}
                    className="flex justify-center min-w-[200px] mt-4 items-center gap-4 px-6 py-3 rounded-xl text-[#fff] bg-primary "
                  >
                    {" "}
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
                        <strong>Name</strong> {contributionPlan?.data?.fullName}
                      </p>
                      <p className=" flex flex-col">
                        <strong>Email</strong>{" "}
                        {contributionPlan?.data?.emailAddress}
                      </p>
                      <p className=" flex flex-col">
                        <strong>Phone No</strong>{" "}
                        {contributionPlan?.data?.phoneNumber}
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

                <LoanTabs
                  activities={contributionPlan?.data?.activities}
                  transactions={contributionPlan?.data?.weeklyInflow}
                  totalWeek={contributionPlan?.data?.durationInWeeks}
                />
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Offline Payment</h2>
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
            onSubmit={handleSubmit(onSubmitPayment)}
          >
            <FormFieldComp
              label="Offline Payment Type"
              name="offlinePaymentType"
              type="select"
              setValue={setValue}
              register={register}
              validation={{ required: "Paymemt Type is required" }}
              options={offLinePaymentOptions}
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
        </Box>
      </Modal>
    </div>
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

export default SavingsManagement;
