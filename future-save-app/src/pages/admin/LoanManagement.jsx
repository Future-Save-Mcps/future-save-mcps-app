import AdminTableComponent from "@/components/AdminTableComponent";
import { Drawer } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Spinner from "@/components/Spinner";
import OngoingCompletedCard from "@/components/Cards/OngoingCompletedCard";
import { useApiGet } from "@/hooks/useApi";
import { formatDate } from "@/utils/formatDate";
import LoanTabs from "@/components/LoanTabs";
import { formatCurrency } from "@/utils/currencyFormatter";
import SendImg from "../../assets/send.svg";
import Warning from "@/components/Cards/Warning";


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

const LoanManagement = () => {

  const [state, setState] = useState(false);
  const [loanId, setLoanId] = useState(null);

  const toggleDrawer =
  (open, id = null) =>
  (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    // setPlanId(id);
    setState(open);
  };



  const handleOpenPaymentModal = (type) => {
    setPaymentModalType(type);
    setOpenPaymentModal(true);
  };
  const handleClosePaymentModal = () => {
    setOpenPaymentModal(false);
    setPaymentModalType(null);
  };
  const {
    data: loan,
    isLoading: isLoadingLoan,
    refetch: refetchLoan,
  } = useApiGet(`loan/all?PageNumber=1&PageSize=100`);
  
  const {
    data: loanPlan,
    isLoading: isLoadingLoanPlan,
    isFetching,
    refetch: refetchLoanPlan,
  } = useApiGet(`loan?LoanId=${loanId}`);
  const tableHeaders = [
    "Name",
    "Loan Type",
    "Target Amount",
    "Date Created",
    "Weekly Amount",
    "Account Status",
    "Action",
  ];

  const rawTableData = [
    {
      id: 1,
      name: "Williams Elum",
      plan: "Thrift Loan",
      targetAmount: "₦ 300,000.00",
      dateCreated: "12/05/2025",
      weeklyAmount: "₦ 5,000.00",
      status: "Approved",
    },
    {
      id: 2,
      name: "Williams Elum",
      plan: "Premium Loan",
      targetAmount: "₦ 300,000.00",
      dateCreated: "12/05/2025",
      weeklyAmount: "₦ 5,000.00",
      status: "Rejected",
    },
    {
      id: 2,
      name: "Williams Elum",
      plan: "Premium Loan",
      targetAmount: "₦ 300,000.00",
      dateCreated: "12/05/2025",
      weeklyAmount: "₦ 5,000.00",
      status: "Pending",
    },
  ];

  const tableData = rawTableData.map((item) => ({
    ...item,
    status: (
      <span
        className={`px-3 py-1 flex w-fit items-center gap-2 rounded-2xl  ${
          item.status === "Approved"
            ? "bg-[#34C7591F]  text-[#34C759]"
            : item.status === "Rejected"
            ? "bg-[#FB03001F]  text-[#FB0300]"
            : "bg-[#FF790C1F]  text-[#FF790C]"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            item.status === "Approved"
              ? "bg-[#34C759]"
              : item.status === "Rejected"
              ? "bg-[#FB0300]"
              : "bg-[#FF790C]"
          }`}
        ></div>{" "}
        {item.status}
      </span>
    ),
  }));

  // Search Function
  const handleSearch = (query, data) => {
    console.log(query);

    // return data.filter((item) =>
    //   item.name.toLowerCase().includes(query.toLowerCase())
    // );
  };

  // Filter Function
  const handleFilter = (filter, data) => {
    // if (!filter) return data;
    // return data.filter((item) => item.status === filter);
    console.log("this is the filter");
  };

  // Export Function (Dummy Example)
  const handleExport = () => {
    console.log("Exporting data...");
  };

  // Audit Trail Function (Dummy Example)
  const handleAuditTrail = () => {
    console.log("Viewing audit trail...");
  };

  return (
    <div>
      <AdminTableComponent
        headers={tableHeaders}
        data={tableData}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onExport={handleExport}
        onAuditTrail={handleAuditTrail}
        view={toggleDrawer}
      />

{/* <Drawer anchor="right" open={state}>
        <div className=" w-[100vw] max-w-[700px]">
          <div className=" flex  p-4  bg-white sticky top-0 justify-between mb-8 items-center ">
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
                  transactions={contributionPlan?.data?.transactions}
                  activities={contributionPlan?.data?.activities}
                />
              </>
            )}
          </div>
        </div>
      </Drawer> */}

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
                {/* {loanPlan?.data?.loanStatus === "PendingApproval" && ( */}
                  <Warning
                    WarningType="Yellow"
                    text="You Loan is being processed "
                  />
                {/* )} */}

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
                  {/* {loanPlan?.data?.loanStatus !== "PendingApproval" ||
                  loanPlan?.data?.loanStatus !== "completed" ||
                  (loanPlan?.data?.loanStatus !== "rejected" && ( */}
                  <button
                    onClick={handleOpenPaymentModal}
                    className="flex my-6 justify-center items-center gap-6 px-6 py-3 rounded-xl text-[#fff] bg-primary "
                  >
                    {" "}
                    <img src={SendImg} alt="" /> Make Repayment
                  </button>
                  {/* ))} */}
                </div>

                <div style={styles.card}>
                  <div style={styles.row}>
                    {/* <div style={styles.column}>
                <div className="w-fit m-auto">
                  <p>
                    <strong>Weekly Repayment</strong>
                  </p>
                  <p>NGN 15,650.00</p>
                </div>
              </div> */}
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
                    {/* <div style={styles.column}>
                    <div className="w-fit m-auto">
                      <p>
                        <strong>End Date</strong>
                      </p>
                      <p>{loanPlan?.data?.endDate}</p>
                    </div>
                  </div> */}
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

                <LoanTabs activities={loanPlan?.data?.activities} />
              </>
            )}
          </div>
        </div>
      </Drawer>
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

export default LoanManagement;
