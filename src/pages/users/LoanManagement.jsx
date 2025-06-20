import React, { useEffect, useRef, useState } from "react";
import OngoingCompletedCard from "../../components/Cards/OngoingCompletedCard";
import Warning from "../../components/Cards/Warning";
import Bg from "../../assets/cardBd.svg";
import WarningImg from "../../assets/warning.svg";
import NotFound from "../../assets/notfound.svg";
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import SendImg from "../../assets/send.svg";
import { Box, Modal, Typography } from "@mui/material";
import LoanTabs from "../../components/LoanTabs";
import { Controller, useForm } from "react-hook-form";
import { useApiGet, useApiPost } from "../../hooks/useApi";
import AplicationForm from "../../components/ApplicationForm";
import NoLoan from "../../assets/NoLoan.svg";
import Spinner from "../../components/Spinner";
import { formatCurrency } from "../../utils/currencyFormatter";
import ReusablePaystackButton from "@/components/paystack/PaystackButton";
import { getUserData } from "@/utils/getUserData";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95vw",
  bgcolor: "white",
  border: "none",
  outline: "none",
  p: 4,
  maxWidth: "500px",
  borderRadius: "20px",
};

//

const LoanManagement = () => {
  const [state, setState] = useState(false);
  const [loanId, setLoanId] = useState(null);
  const { post, isLoading } = useApiPost();
  const userData = getUserData();

  const {
    data: eligibleData,
    error,
    refetch,
  } = useApiGet("loan/eligible");

  const {
    data: loanPlan,
    isLoading: isLoadingLoanPlan,
    isFetching,
    refetch: refetchLoanPlan,
  } = useApiGet(`loan?LoanId=${loanId}`);

  useEffect(() => {
    console.log("this is load details", loanPlan);
  }, [loanPlan, loanId]);

  const {
    data: loan,
    isLoading: isLoadingLoan,
    refetch: refetchLoan,
  } = useApiGet(`loan/all?PageNumber=1&PageSize=100`);

  const [modalType, setModalType] = useState("Success"); // Success or Error
  function checkEligibility() {
    // const { isEligibleForThriftLoan, isEligibleForPremiumLoan } = data?.data;

    if (
      eligibleData?.data?.isEligibleForThriftLoan &&
      eligibleData?.data?.isEligibleForPremiumLoan
    ) {
      return {
        text: "You're eligible for both Thrift and Premium loans.",
        color: "Green",
      };
    } else if (eligibleData?.data?.isEligibleForThriftLoan) {
      return {
        text: "You're eligible for a Thrift loan.",
        color: "Yellow",
      };
    } else if (eligibleData?.data?.isEligibleForPremiumLoan) {
      return {
        text: "You're eligible for a Premium loan.",
        color: "Yellow",
      };
    } else {
      return {
        text: "You're not eligible for any loans at this time.",
        color: "Red",
      };
    }
  }
  const [open, setOpen] = useState(false);
  const [loanType, setLoanType] = useState(null);
  const paystackBtnRef = useRef(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [paymentData, setPaymentData] = useState({
    reference: null,
    amount: null,
  });

  const [activeTab, setActiveTab] = useState("ongoing");
  const [eligible, setEligible] = useState(false);
  const [errorType, setErrorType] = useState(null);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setEligible(false);
  };

  const handleOpenApplyThrift = () => {
    setLoanType("Thrift");
    if (eligibleData?.data?.isEligibleForThriftLoan) {
      setEligible(true);
    } else {
      setEligible(false);
      setErrorType("NoPlanYet"); //NoPlanYet or runningLoan
    }
    setOpen(true);
  };

  const handleOpenApplyPremium = () => {
    setLoanType("Premium");
    if (eligibleData?.data?.isEligibleForPremiumLoan) {
      setEligible(true);
    } else {
      setEligible(false);
      setErrorType("NoPlanYet"); //NoPlanYet or runningLoan
    }
    setOpen(true);
  };

  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const handleOpenPaymentModal = () => {
    setOpenPaymentModal(true);
  };

  const handleSuccess = (reference) => {
    console.log("Payment successful:", reference);
    // setTimeout(() => {
    // handleClosePaymentModal();
    // }, 3000);
  };

  const handleClosePaystack = () => {
    console.log("Payment cancelled");
  };

  const handleClosePaymentModal = () => setOpenPaymentModal(false);

  const toggleDrawer =
    (open, id = null) =>
    (event) => {
      if (
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setLoanId(id);
      setState(open);
    };

  const ggg = () => {
    console.log(hello);
  };

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      paymentType: "CurrentWeekPayment",
      numberOfWeeks: "2",
      weeklyAmount: 0, // temporary default
    },
  });
  
  useEffect(() => {
    if (loanPlan?.data?.weeklyRepaymentAmount) {
      setValue("weeklyAmount", loanPlan.data.weeklyRepaymentAmount);
    }
  }, [loanPlan, setValue]);
  
  const paymentType = watch("paymentType");
  const numberOfWeeks = watch("numberOfWeeks");
  const weeklyAmount = watch("weeklyAmount");
  const onSubmit = async (data) => {
    const formData = {
      loanApplicationId: loanId,
      amount: data.weeklyAmount,
      paymentType: data.paymentType,
    };

    const result = await post(`loan/add-loan-fund`, formData);

    if (result.success && result.data) {
      refetchLoanPlan();
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

  useEffect(() => {
    console.log("thi is eligibleData", eligibleData);
  }, [eligibleData]);

  const tabs = [
    { id: "ongoing", label: "OnGoing" },
    { id: "completed", label: "Completed" },
    { id: "rejected", label: "Rejected" },
  ];

  const filterLoans = (status) => {
    return loan?.data?.items?.filter((plan) => plan.loanStatus === status);
  };

  const renderTabContent = () => {
    if (!loan?.data?.items) {
      return (
        <div className="flex mt-12 justify-center items-center">
          <img src={NoLoan} alt="" />
        </div>
      );
    }

    const filterLoans = (status) => {
      return loan.data.items.filter((plan) => plan.loanStatus === status);
    };

    const calculatePercentage = (loan) => {
      // This is a placeholder calculation. Adjust according to your actual data structure
      const totalAmount = Number.parseFloat(loan.loanAmount);
      const balance = Number.parseFloat(loan.loanBalance);
      return Math.round(((totalAmount - balance) / totalAmount) * 100);
    };

    const getRemainingDays = (loan) => {
      // This is a placeholder calculation. Adjust according to your actual data structure
      const endDate = new Date(loan.endDate);
      const today = new Date();
      const remainingDays = Math.ceil(
        (endDate - today) / (1000 * 60 * 60 * 24)
      );
      return `${remainingDays} days remaining`;
    };

    switch (activeTab) {
      case "ongoing":
        const ongoingLoans = filterLoans("InProgress");
        return ongoingLoans?.length > 0 ? (
          ongoingLoans.map((loan) => (
            <OngoingCompletedCard
              key={loan.loanApplicationId}
              onClick={toggleDrawer(true, loan.loanApplicationId)}
              percentage={
                loan.loanStatus === "completed"
                  ? 100
                  : ((loan.totalRepaymentAmount - loan.remainingBalance) /
                      loan.totalRepaymentAmount) *
                    100
              }
              cardType="Loan"
              loanAmount={loan.loanAmount}
              loanBalance={loan.loanBalance}
              status="inProgress"
              cardTitle={loan.loanType}
              remainingDays={` ${loan.remainingDays} days remaining`}
            />
          ))
        ) : (
          <div className="flex mt-12 justify-center items-center">
            <img src={NoLoan} alt="" />
          </div>
        );
      case "completed":
        const completedLoans = filterLoans("Completed");
        return completedLoans?.length > 0 ? (
          completedLoans.map((loan) => (
            <OngoingCompletedCard
              key={loan.loanApplicationId}
              onClick={toggleDrawer(true, loan.loanApplicationId)}
              percentage={
                loan.loanStatus === "completed"
                  ? 100
                  : ((loan.totalRepaymentAmount - loan.remainingBalance) /
                      loan.totalRepaymentAmount) *
                    100
              }
              cardType="Loan"
              loanAmount={loan.loanAmount}
              loanBalance="₦0.00"
              status="completed"
              cardTitle={loan.loanType}
              remainingDays="Completed"
            />
          ))
        ) : (
          <div className="flex mt-12 justify-center items-center">
            <img src={NoLoan} alt="" />
          </div>
        );
      case "rejected":
        const rejectedLoans = filterLoans("Rejected");
        return rejectedLoans?.length > 0 ? (
          rejectedLoans.map((loan) => (
            <OngoingCompletedCard
              key={loan.loanApplicationId}
              onClick={toggleDrawer(true, loan.loanApplicationId)}
              percentage={
                loan.loanStatus === "completed"
                  ? 100
                  : ((loan.totalRepaymentAmount - loan.remainingBalance) /
                      loan.totalRepaymentAmount) *
                    100
              }
              cardType="Loan"
              loanAmount={loan.loanAmount}
              loanBalance={loan.loanAmount}
              status="rejected"
              cardTitle={loan.loanType}
              remainingDays="Rejected"
            />
          ))
        ) : (
          <div className="flex mt-12 justify-center items-center">
            <img src={NoLoan} alt="" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div>
        <Warning
          WarningType={checkEligibility()?.color}
          text={checkEligibility()?.text}
        />
        <div className="flex gap-6 mb-8">
          <div
            style={{
              backgroundImage: `url(${Bg})`,
              backgroundSize: "contain",
              backgroundRepeat: "repeat",
              backgroundPosition: "center",
            }}
            className="min-h-[200px] border bg-[#72109D] gap-4 p-4 flex flex-col justify-center items-center flex-1 rounded-2xl"
          >
            <div className="font-[700] text-center text-[28px] text-[#fff] ">
              Thrift Loan
            </div>
            <div className="font-[400] text-center text-[16px] text-[#fff]">
              4.2% monthly interest
            </div>
            <button
              onClick={handleOpenApplyThrift}
              className="border text-[18px] font-[600] text-[#72109D] bg-[#fff] py-2 w-[60%] flex items-center justify-center rounded-xl"
            >
              Apply
            </button>
          </div>
          <div
            style={{
              backgroundImage: `url(${Bg})`,
              backgroundSize: "contain",
              backgroundRepeat: "repeat",
              backgroundPosition: "center",
            }}
            className="min-h-[200px] border bg-[#1DAB40] gap-4 p-4 flex flex-col justify-center items-center flex-1 rounded-2xl"
          >
            <div className="font-[700] text-center text-[28px] text-[#fff] ">
              Premium Loan
            </div>
            <div className="font-[400] text-center text-[16px] text-[#fff]">
              8.4% monthly interest
            </div>
            <button
              onClick={handleOpenApplyPremium}
              className="border text-[18px] font-[600] text-[#1DAB40] bg-[#fff] py-2 w-[60%] flex items-center justify-center rounded-xl"
            >
              Apply
            </button>
          </div>{" "}
        </div>
        <h2 className="text-[24px] font-[600] mb-4 ">My Loans</h2>

        <div className="max-w-[550px] border min-h-[500px] p-4 rounded-2xl">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 text-[20px] font-[600] p-4 ${
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-[#717171]"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-4">{renderTabContent()}</div>
        </div>
        
      </div>
      <Drawer anchor="right" open={state}>
        <div className=" w-[100vw] relative max-w-[700px]">
          <div className=" p-4  bg-white  sticky top-0 flex justify-between mb-8 items-center ">
            <h2 className="text-[24px] font-[700]">Loan Details</h2>
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
                {loanPlan?.data?.loanStatus === "PendingApproval" && (
                  <Warning
                    WarningType="Yellow"
                    text="You Loan is being processed "
                  />
                )}

                <OngoingCompletedCard
                  percentage={
                    loanPlan?.data?.loanStatus === "completed"
                      ? 100
                      : ((loanPlan?.data?.totalRepaymentAmount -
                          loanPlan?.data?.remainingBalance) /
                          loanPlan?.data?.totalRepaymentAmount) *
                        100
                  }
                  cardType={"Loan"}
                  loanAmount={formatCurrency(
                    loanPlan?.data?.totalRepaymentAmount
                  )}
                  loanBalance={formatCurrency(loanPlan?.data?.remainingBalance)}
                  status={loanPlan?.data?.loanStatus}
                  cardTitle={loanPlan?.data?.loanType}
                  remainingDays={` ${loanPlan?.data?.remainingDays} days remaining`}
                />

                <div className="flex justify-center items-center">
                 
                  <button
                    onClick={handleOpenPaymentModal}
                    className="flex my-6 justify-center items-center gap-6 px-6 py-3 rounded-xl text-[#fff] bg-primary "
                  >
                    {" "}
                    <img src={SendImg} alt="" /> Make Repayment
                  </button>
                </div>

                <div style={styles.card}>
                  <div style={styles.row}>
                    <div style={styles.column}>
                      <div className="w-fit m-auto">
                        <p>
                          <strong>Target Amount</strong>
                        </p>
                        <p>
                          {formatCurrency(loanPlan?.data?.totalRepaymentAmount)}
                        </p>
                      </div>
                    </div>
                    <div style={styles.column}>
                      <div className="w-fit m-auto">
                        <p>
                          <strong>Start Date</strong>
                        </p>
                        <p>{loanPlan?.data?.userRepaymentStartDate}</p>
                      </div>
                    </div>
                  </div>
                  <div style={styles.row}>
                    <div style={styles.column}>
                      <div className="w-fit m-auto">
                        <p>
                          <strong>Interest Payable</strong>
                        </p>
                        <p>
                          {formatCurrency(
                            (
                              loanPlan?.data?.interestAmount *
                              loanPlan?.data?.repaymentDurationInMonth
                            ).toFixed()
                          )}
                        </p>
                      </div>
                    </div>
                    <div style={styles.column}>
                      <div className="w-fit m-auto">
                        <p>
                          <strong>Duration</strong>
                        </p>
                        <p>{loanPlan?.data?.repaymentDurationInMonth} Months</p>
                      </div>
                    </div>
                  </div>
                  <div style={styles.row}>
                    <div style={styles.column}>
                      <div className="w-fit m-auto">
                        <p>
                          <strong>1st Guarantor</strong>
                        </p>
                        <p>
                          {loanPlan?.data?.guarantors[0].fullName +
                            ` (${loanPlan?.data?.guarantors[0].subscriptionCode})`}
                        </p>
                        <p>{`(${loanPlan?.data?.guarantors[0].email})`}</p>
                      </div>
                    </div>
                    <div style={styles.column}>
                      <div className="w-fit m-auto">
                        <p>
                          <strong>2nd Guarantor</strong>
                        </p>
                        <p>
                          {loanPlan?.data?.guarantors[1].fullName +
                            ` (${loanPlan?.data?.guarantors[1].subscriptionCode})`}
                        </p>
                        <p>{`(${loanPlan?.data?.guarantors[1].email})`}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <LoanTabs activities={loanPlan?.data?.activities} transactions={loanPlan?.data?.weeklyInflow} totalWeek={loanPlan?.data?.durationInWeeks} />
              </>
            )}
          </div>
        </div>
      </Drawer>

      <Modal
        open={openPaymentModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add Funds</h2>
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

          <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Payment Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Type
                </label>
                <Controller
                  name="paymentType"
                  control={control}
                  render={({ field }) => (
                    <div className="flex gap-4">
                      <label
                        className={`flex items-center space-x-2 flex-1  p-3 rounded-md border ${
                          field.value === "CurrentWeekPayment" ? "border-primary" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          {...field}
                          value="CurrentWeekPayment"
                          checked={field.value === "CurrentWeekPayment"}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span>This week payment</span>
                      </label>
                      <label
                        className={`flex items-center space-x-2 flex-1  p-3 rounded-md border ${
                          field.value === "AdvancePayment" ? "border-primary" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          {...field}
                          value="AdvancePayment"
                          checked={field.value === "AdvancePayment"}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span>Advance Payment</span>
                      </label>
                    </div>
                  )}
                />
              </div>

              {/* Number of weeks - only show if Advance Payment is selected */}
              {paymentType === "AdvancePayment" && (
                <div className="mt-4 space-y-2">
                  <label
                    htmlFor="numberOfWeeks"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Number of weeks (25 weeks Plan)
                  </label>
                  <Controller
                    name="numberOfWeeks"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="mt-1 block border w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                      >
                        {[...Array(25)].map((_, i) => (
                          <option key={i + 1} value={String(i + 1)}>
                            {i + 1} {i === 0 ? "week" : "weeks"}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
              )}

              {/* Weekly Amount */}
              <div className="mt-4 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Weekly Amount (Your weekly payment is NGN {loanPlan?.data?.weeklyRepaymentAmount})
                </label>
                <div className="text-2xl h-[100px] flex justify-center items-center rounded-lg mb-6 border font-semibold">
                  ₦
                  {(
                    Number(paymentType === "AdvancePayment" ? numberOfWeeks : 1) *
                    weeklyAmount
                  ).toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>

              {/* <button
                type="submit"
                className="w-full py-2 px-4 mt-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00205C] hover:bg-[#001845] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00205C]"
              >
                Make payment
              </button> */}
                <div className="flex items-center gap-3 mt-4 mb-2">
                  <label
                    htmlFor="addFundsToggle"
                    className="text-sm font-medium text-primary"
                  >
                    Initiate Funds Transfer
                  </label>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="addFundsToggle"
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleSubmit(onSubmit)(); // manually submit the form
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer-focus:ring-2 peer-focus:ring-primary peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5"></div>
                  </label>
                </div>

              {/* <ReusablePaystackButton
                afterClose={handleClosePaymentModal}
                email={"ayo@yopmail.com"}
                amount={
                  Number(paymentType === "advance" ? numberOfWeeks : 1) *
                  weeklyAmount
                }
                currency="NGN"
                metadata={{
                  event_name: "Tech Conference 2024",
                  ticket_type: "early_bird",
                  event_date: "2024-06-15",
                }}
                onSuccess={handleSuccess}
                onClose={handleClosePaymentModal}
                text="Make payment"
                className="w-full py-2 px-4 mt-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00205C] hover:bg-[#001845] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00205C]"
              /> */}
            </form>
            {formSubmitted && paymentData?.reference && (
                <ReusablePaystackButton
                  afterClose={ () => {handleClosePaymentModal(); refetchLoanPlan();} }
                  email={userData?.data?.email}
                  amount={
                    Number(paymentType === "AdvancePayment" ? numberOfWeeks : 1) *
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
        </Box>
      </Modal>

      <AplicationForm
        open={open}
        handleClose={handleClose}
        eligible={eligible}
        errorType={errorType}
        loanType={loanType}
      />
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

export default LoanManagement;
