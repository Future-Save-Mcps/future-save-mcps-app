import React, { useEffect, useState } from "react";
import OngoingCompletedCard from "../../components/Cards/OngoingCompletedCard";
import Warning from "../../components/Cards/Warning";
import Bg from "../../assets/cardBd.svg";
import WarningImg from "../../assets/warning.svg";
import NotFound from "../../assets/notfound.svg";
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
  const [state, setState] = useState(false);
  const [planId, setPlanId] = useState(null);
  const { data, refetch } = useApiGet("user/dashboard");

  const { data: contributionPlan, isLoading: isLoadingContributionPlan } =
    useApiGet(`savingsplan?PlanId=${planId}`);

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
  const savingsPlan = watch("savingsPlan", "25"); // Default to '25' weeks plan

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
      handleClose();
    }
  };

  const [open, setOpen] = useState(false);
  const [onChangeValue, setOnChangeValue] = useState(5000);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const handleOpenPaymentModal = () => {
    setOpenPaymentModal(true);
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

  return (
    <>
      <div>
        <div className="flex gap-6 mb-8">
          <div className="min-h-[150px] border gap-4 p-4 flex flex-col justify-center items-center flex-1 rounded-2xl">
            <div className="font-[400] text-center text-[16px] text-primary">
              Total Savings{" "}
            </div>
            <div className="font-[700] text-center text-[28px]">
              ₦ {data?.data?.userDashboard?.totalSavingsBalance}
            </div>
          </div>
          <div className="min-h-[150px] bg-[#041F620D] gap-4 p-4 flex flex-col justify-center items-center flex-1 rounded-2xl">
            <div className="font-[400] text-center text-[16px] text-primary">
              Total Savings Dividends
            </div>
            <div className="font-[700] text-center text-[28px]">
              ₦ {data?.data?.userDashboard?.totalDividendBalance}{" "}
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
            <button className="flex-1 text-[20px] font-[600] p-4 border-b-2 border-primary">
              Ongoing
            </button>
            <button className="flex-1 text-[20px] font-[600] text-[#717171] p-4">
              Completed
            </button>
          </div>
          <div className="">
            <OngoingCompletedCard
              id={"3458f4a0-00ce-42b5-8840-b6d7958ee501"}
              cardTitle={"Ajor Money"}
              contrubutionBalance={"₦ 5000"}
              contributionWeekPlan={"25 weeks Plan"}
              status={"In Progress"}
              remainingDays={" 299 days remaining"}
              onClick={toggleDrawer(
                true,
                "3458f4a0-00ce-42b5-8840-b6d7958ee501"
              )}
              percentage={20}
            />
            <OngoingCompletedCard
              id={"3458f4a0-00ce-42b5-8840-b6d7958ee501"}
              cardTitle={"Ajor Money"}
              contrubutionBalance={"₦ 10000"}
              contributionWeekPlan={"50 weeks Plan"}
              status={"In Progress"}
              remainingDays={" 299 days remaining"}
              onClick={toggleDrawer(
                true,
                "3458f4a0-00ce-42b5-8840-b6d7958ee501"
              )}
              percentage={40}
            />
          </div>
        </div>
      </div>
      <Drawer anchor="right" open={state}>
        <div className="p-4 w-[100vw] max-w-[700px]">
          <div className=" flex justify-between mb-8 items-center ">
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
          <OngoingCompletedCard
            cardTitle={contributionPlan?.data?.planName}
            contrubutionBalance={`₦ ${contributionPlan?.data?.currentBalance}`}
            contributionWeekPlan={`${contributionPlan?.data?.durationInWeeks} weeks Plan`}
            status={contributionPlan?.data?.planStatus}
            remainingDays={` ${contributionPlan?.data?.daysRemaining} days remaining`}
            onClick={toggleDrawer(true)}
            percentage={
              contributionPlan?.data?.currentBalance < 1
                ? 0
                : (contributionPlan?.data?.currentBalance /
                    contributionPlan?.data?.targetAmount) *
                  100
            }
          />

          {/* (data?.data?.userSavingsProgress?.totalSavingsCurrentBalance /
        data?.data?.userSavingsProgress?.totalSavingsTarget) *
      100 */}

          <div className="flex justify-center gap-6 flex-wrap items-center">
            <button
              onClick={handleOpenPaymentModal}
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
              onClick={handleOpenPaymentModal}
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

          <LoanTabs activities={contributionPlan?.data?.activities} />
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

            <FormFieldComp
              label="Start Date"
              name="startDate"
              type="date"
              register={register}
              validation={{
                required: "Start date is required",
              }}
              errors={errors}
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
        <Box sx={style}>hello</Box>
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
