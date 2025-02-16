import { Box, FormControlLabel, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import WarningImg from "../assets/warning.svg";
import NotFound from "../assets/notfound.svg";
import FormButton from "./FormBtn";
import { Controller, useForm } from "react-hook-form";
import FormFieldComp from "./form/FormFieldComp";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { calculateLoanDetails } from "../utils/calculateLoanDetails";
import { useApiPost } from "../hooks/useApi";
import { formatCurrency } from "../utils/currencyFormatter";

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

const AplicationForm = ({
  errorType,
  loanType,
  eligible,
  handleClose,
  open,
  // navigate,
}) => {
  const { post, isLoading } = useApiPost();
  //error type is either NoPlanYet or runningLoan

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const [loanAmount, setLoanAmount] = useState();
  const [loanCalculation, setLoanCalculation] = useState({});

  const paymentDuration = watch("paymentDuration");
  // calculateLoanDetails
  useEffect(() => {
  

    const monthlyInterestRate = 0.042;
    const calculate = calculateLoanDetails(
      loanAmount,
      paymentDuration,
      monthlyInterestRate
    );

    setLoanCalculation(calculate);
  }, [loanAmount, paymentDuration]);

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    // event.preventDefault();
    // console.log(data); // You can log the form data to check

    const requestBody = {
      loanType: loanType,
      loanAmount: loanAmount,
      repaymentStartDate: new Date(data.repaymentStartDate).toISOString(),
      guarantor1SubscriptionCode: data.guarantorOneSubscriptionCode,
      guarantor1SubscriptionFullName: data.guarantorOneFullName,
      guarantor1SubscriptionEmail: data.guarantorOneFullEmail,
      guarantor2SubscriptionCode: data.guarantorTwoSubscriptionCode,
      guarantor2SubscriptionFullName: data.guarantorTwoFullName,
      guarantor2SubscriptionEmail: data.guarantorTwoFullEmail,
      totalRepaymentAmount: loanCalculation.totalRepaymentAmount, // Assuming a bank account ID input field in your form
      loanReason: data.reason,
    };
    console.log(requestBody);

    try {
     
      const result = await post("/loan", requestBody);
      if (result.success) {
        handleClose();

        // Handle success (refetch data, close modal, etc.)
      }
    } catch (err) {
      console.error("Error creating loan:", err);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {eligible ? (
        <Box sx={style}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{loanType} Loan</h2>
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
              label="Loan Amount (Max. of NGN 375,000.00)"
              name="loanAmount"
              type="number"
              onchange={true}
              setOnChangeValue={setLoanAmount}
              //   placeholder="Amount"
              register={register}
              validation={{
                required: "Name of savings is required",
              }}
              errors={errors}
            />

            <FormFieldComp
              label="Repayment Duration"
              name="paymentDuration"
              setValue={setValue}
              type="select"
              register={register}
              validation={{
                required: "Name of savings is required",
              }}
              options={[
                { label: "25 weeks", value: 25 },
                { label: "50 weeks", value: 50 },
              ]}
              errors={errors}
            />

            {/* <FormFieldComp
              label="Interest (4.2% per month)"
              name="interest"
              type="text"
              // readOnly
              //   placeholder="interest"
              register={register}
              validation={{
                required: "Name of savings is required",
              }}
              errors={errors}
            /> */}

            {/* <FormFieldComp
              label="Total Repayment Amount"
              name="totalRapayment"
              type="text"
              // readOnly
              //   placeholder="Total Rapayment"
              register={register}
              validation={{
                required: "Name of savings is required",
              }}
              errors={errors}
            /> */}

            {/* <FormFieldComp
              label="Weekly Repayment"
              name="WeeklyRapayment"
              type="text"
              // readOnly
              //   placeholder="Weekly Rapayment"
              register={register}
              validation={{
                required: "Name of savings is required",
              }}
              errors={errors}
            /> */}

            <FormFieldComp
              //   setValue={setValue}
              label="Repayment Start Date"
              name="repaymentStartDate"
              type="date"
              // placeholder="125000"
              register={register}
              validation={{
                required: "Repayment Start Date is required",
              }}
              errors={errors}
            />

            <FormFieldComp
              label="Reason for requesting for loan"
              name="reason"
              type="text"
              // placeholder="Weekly Rapayment"
              register={register}
              validation={{
                required: "Reason for requesting for loan is required",
              }}
              errors={errors}
            />

            <div className="text-lg mt-6 mb-1 font-semibold">Guarantor 1</div>
            <FormFieldComp
              label="Subscription Code"
              name="guarantorOneSubscriptionCode"
              type="text"
              // placeholder="Weekly Rapayment"
              register={register}
              validation={{
                required: "Subscription Code is required",
              }}
              errors={errors}
            />

            <FormFieldComp
              label="Full Name"
              name="guarantorOneFullName"
              type="text"
              // placeholder="Weekly Rapayment"
              register={register}
              validation={{
                required: "Full Name is required",
              }}
              errors={errors}
            />

            <FormFieldComp
              label="Email Address"
              name="guarantorOneFullEmail"
              type="text"
              // placeholder="Weekly Rapayment"
              register={register}
              validation={{
                required: "Email Address is required",
              }}
              errors={errors}
            />

            <div className="text-lg mt-6 mb-1 font-semibold">Guarantor 2</div>
            <FormFieldComp
              label="Subscription Code"
              name="guarantorTwoSubscriptionCode"
              type="text"
              // placeholder="Weekly Rapayment"
              register={register}
              validation={{
                required: "Subscription Code is required",
              }}
              errors={errors}
            />

            <FormFieldComp
              label="Full Name"
              name="guarantorTwoFullName"
              type="text"
              // placeholder="Weekly Rapayment"
              register={register}
              validation={{
                required: "Full Name is required",
              }}
              errors={errors}
            />

            <FormFieldComp
              label="Email Address"
              name="guarantorTwoFullEmail"
              type="text"
              // placeholder="Weekly Rapayment"
              register={register}
              validation={{
                required: "Email Address is required",
              }}
              errors={errors}
            />

            <div className="mb-4 f">
              <div className=" mt-8 bg-[#edf0ff] p-2 rounded-lg ">
                <div className="flex mb-2 justify-between">
                  <div className="flex justify-between w-full">
                    Interest (4.2% per month) :{" "}
                    <span className="font-semibold">
                      {formatCurrency(
                        loanCalculation.monthlyInterestAmount === "NaN"
                          ? 0
                          : loanCalculation.monthlyInterestAmount
                      )}
                    </span>{" "}
                  </div>
                </div>

                <div className="flex mb-2 justify-between">
                  <div className="flex justify-between w-full">
                    Weekly Repayment :{" "}
                    <span className="font-semibold">
                      {" "}
                      {formatCurrency(
                        loanCalculation.weeklyRepayment === "NaN" ||
                          loanCalculation.weeklyRepayment === "Infinity"
                          ? 0
                          : loanCalculation.weeklyRepayment
                      )}
                    </span>{" "}
                  </div>
                </div>

                <div className="flex mb-2 justify-between">
                  <div className="flex justify-between w-full">
                    Total Repayment Amount :{" "}
                    <span className="font-semibold">
                      {" "}
                      {formatCurrency(
                        loanCalculation.totalRepaymentAmount === "NaN"
                          ? 0
                          : loanCalculation.totalRepaymentAmount
                      )}
                    </span>{" "}
                  </div>
                </div>
              </div>
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
                          I agree that If I must repay this loan as and when due
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
      ) : (
        <>
          {errorType === "runningLoan" ? (
            <Box sx={style}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{loanType} Loan</h2>
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
                <h2 className="text-xl font-semibold">{loanType} Loan</h2>
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

              <h2 className="text-lg text-center font-semibold">
                {loanType} Loan!
              </h2>
              <p className="max-w-[80%] text-center m-auto my-4 text-[16px] text-[#B0B0B0] ">
                You are not eligible because you do not have a{" "}
                {loanType === "Thrift" ? "25" : "12"} weeks savings plan yet
              </p>

              <img
                src={WarningImg}
                width="30%"
                className="m-auto my-4"
                alt=""
              />
              <button
                onClick={() => navigate("/user/contribution_plan")}
                className="bg-primary w-[100%] p-3 mt-6 rounded-lg text-white "
              >
                Start Contribution Plan
              </button>
            </Box>
          )}
        </>
      )}
    </Modal>
  );
};

export default AplicationForm;
