import React, { useEffect, useState } from "react";
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
import { useApiGet } from "../../hooks/useApi";
import AplicationForm from "../../components/ApplicationForm";
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
  const {
    data: eligibleData,
    isLoading,
    error,
    refetch,
  } = useApiGet("loan/eligible");

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
  const handleClosePaymentModal = () => setOpenPaymentModal(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState(open);
  };

  const ggg = () => {
    console.log(hello);
  };

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      paymentType: "this-week",
      numberOfWeeks: "2",
      weeklyAmount: 5000,
    },
  });

  const paymentType = watch("paymentType");
  const numberOfWeeks = watch("numberOfWeeks");
  const weeklyAmount = watch("weeklyAmount");

  const onSubmit = (data) => {
    console.log(data);
    // Handle payment submission
  };

  useEffect(() => {
    console.log("thi is eligibleData", eligibleData);
  }, [eligibleData]);

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
        <div className=" max-w-[550px] border min-h-[500px] p-4 rounded-2xl ">
          <div className="flex border-b ">
            <button className="flex-1 text-[20px] font-[600] p-4 border-b-2 border-primary">
              OnGoing
            </button>
            <button className="flex-1 text-[20px] font-[600] text-[#717171] p-4">
              Completed
            </button>
            <button className="flex-1 text-[20px] font-[600] text-[#717171] p-4">
              Rejected
            </button>
          </div>
          <div className="">
            <OngoingCompletedCard
              onClick={toggleDrawer(true)}
              percentage={20}
              cardType={"Loan"}
              loanAmount={"₦375,000.00 "}
              loanBalance={"₦ 15,650.00"}
              status={"In Progress"}
              cardTitle={"Thrift Loan"}
              remainingDays={" 299 days remaining"}
            />
            <OngoingCompletedCard
              onClick={toggleDrawer(true)}
              percentage={90}
              cardType={"Loan"}
              loanAmount={"₦375,000.00 "}
              loanBalance={"₦ 15,650.00"}
              status={"In Progress"}
              cardTitle={"Premium Loan"}
              remainingDays={" 299 days remaining"}
            />
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={state}>
        <div className="p-4 w-[100vw] max-w-[700px]">
          <div className=" flex justify-between mb-8 items-center ">
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
          <Warning WarningType="Yellow" text="You Loan is being processed " />
          <OngoingCompletedCard
            percentage={90}
            cardType={"Loan"}
            loanAmount={"₦375,000.00 "}
            loanBalance={"₦ 15,650.00"}
            status={"In Progress"}
            cardTitle={"Premium Loan"}
            remainingDays={" 299 days remaining"}
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
                    <strong>Weekly Repayment</strong>
                  </p>
                  <p>NGN 15,650.00</p>
                </div>
              </div>
              <div style={styles.column}>
                <div className="w-fit m-auto">
                  <p>
                    <strong>Target Amount</strong>
                  </p>
                  <p>NGN 125,000.00</p>
                </div>
              </div>
              <div style={styles.column}>
                <div className="w-fit m-auto">
                  <p>
                    <strong>Start Date</strong>
                  </p>
                  <p>01/01/2025</p>
                </div>
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.column}>
                <div className="w-fit m-auto">
                  <p>
                    <strong>End Date</strong>
                  </p>
                  <p>01/07/2025</p>
                </div>
              </div>
              <div style={styles.column}>
                <div className="w-fit m-auto">
                  <p>
                    <strong>Interest Payable</strong>
                  </p>
                  <p>NGN 75,600.00</p>
                </div>
              </div>
              <div style={styles.column}>
                <div className="w-fit m-auto">
                  <p>
                    <strong>Duration</strong>
                  </p>
                  <p>6 Months</p>
                </div>
              </div>
            </div>
            <div style={styles.row}>
              <div style={styles.column}>
                <div className="w-fit m-auto">
                  <p>
                    <strong>1st Guarantor</strong>
                  </p>
                  <p>Nonso Udo</p>
                  <p>(udononso@gmail.com)</p>
                </div>
              </div>
              <div style={styles.column}>
                <div className="w-fit m-auto">
                  <p>
                    <strong>2nd Guarantor</strong>
                  </p>
                  <p>Taiwo Moyo (23#456)</p>
                  <p>(taiwomoyo@gmail.com)</p>
                </div>
              </div>
            </div>
          </div>

          <LoanTabs />
        </div>
      </Drawer>
      {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {modalType === "Error" ? (
          <Box sx={style}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Thrift Loan</h2>
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

            <h2 className="text-lg text-center font-semibold">Error!</h2>
            <p className="max-w-[90%] text-center m-auto my-4 text-[16px] text-[#B0B0B0] ">
              You can not apply for this loan now because you have a similar
              loan that has not been settled yet!
            </p>

            <img src={NotFound} width="50%" className="m-auto my-4" alt="" />
          </Box>
        ) : modalType === "Eligible" ? (
          <Box sx={style}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Thrift Loan</h2>
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

            <h2 className="text-lg text-center font-semibold">Error!</h2>
            <p className="max-w-[90%] text-center m-auto my-4 text-[16px] text-[#B0B0B0] ">
              You can not apply for this loan now because you have a similar
              loan that has not been settled yet!
            </p>

            <img src={NotFound} width="50%" className="m-auto my-4" alt="" />
          </Box>
        ) : (
          <Box sx={style}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Thrift Loan</h2>
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

            <h2 className="text-lg text-center font-semibold">Thrift Loan!</h2>
            <p className="max-w-[80%] text-center m-auto my-4 text-[16px] text-[#B0B0B0] ">
              You are not eligible because you do not have a 25 weeks savings
              plan yet
            </p>

            <img src={WarningImg} width="30%" className="m-auto my-4" alt="" />
            <button className="bg-primary w-[100%] p-3 mt-6 rounded-lg text-white ">
              Start Contribution Plan
            </button>
          </Box>
        )}
      </Modal> */}

      <Modal
        open={openPaymentModal}
        // onClose={handleClosePaymentModal}
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
                          field.value === "this-week" ? "border-primary" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          {...field}
                          value="this-week"
                          checked={field.value === "this-week"}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span>This week payment</span>
                      </label>
                      <label
                        className={`flex items-center space-x-2 flex-1  p-3 rounded-md border ${
                          field.value === "advance" ? "border-primary" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          {...field}
                          value="advance"
                          checked={field.value === "advance"}
                          className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                        />
                        <span>Advance Payment</span>
                      </label>
                    </div>
                  )}
                />
              </div>

              {/* Number of weeks - only show if Advance Payment is selected */}
              {paymentType === "advance" && (
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
                  Weekly Amount (Your weekly payment is NGN 5000.00)
                </label>
                <div className="text-2xl h-[100px] flex justify-center items-center rounded-lg mb-6 border font-semibold">
                  ₦{" "}
                  {(
                    Number(paymentType === "advance" ? numberOfWeeks : 1) *
                    weeklyAmount
                  ).toLocaleString("en-NG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 mt-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00205C] hover:bg-[#001845] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00205C]"
              >
                Make payment
              </button>
            </form>
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
