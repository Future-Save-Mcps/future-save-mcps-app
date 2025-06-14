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
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState(false);
  const [loanId, setLoanId] = useState(searchParams.get("id"));
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const post = useApiPost();
  useEffect(() => {
    if (loanId) {
      setState(true);
    }
  }, [loanId]);

  const toggleDrawer = (id) => {
    window.location.href = `/admin/loan_management?id=${id}`;
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
  } = useApiGet(`admin/loan/all?PageNumber=1&PageSize=100`);

  const {
    data: loanPlan,
    isLoading: isLoadingLoanPlan,
    isFetching,
    refetch: refetchLoanPlan,
  } = useApiGet(`loan?LoanId=${loanId}`);

  const handleConfirmAction = async () => {
    try {
      const res = await post(
        `/admin/approve-or-reject-loan?LoanApplicationId=${loanId}&IsApproved=${
          modalType === "Approval"
        }`
      );

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      toast.success(
        `Loan ${
          modalType === "Approval" ? "approved" : "rejected"
        } successfully`
      );
      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to process loan request");
    }
  };

  const tableHeaders = [
    { label: "Name", value: "fullName" },
    { label: "Loan Type", value: "loanType" },
    { label: "Target Amount", value: "totalRepaymentAmount" },
    { label: "Date Created", value: "userRepaymentStartDate" },
    { label: "Weekly Amount", value: "weeklyRepaymentAmount" },
    { label: "Account Status", value: "loanStatus" },
    // { label: "Action", value: "action" },
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

  const tableData = loan?.data?.items?.map((item) => ({
    ...item,
    id: item.loanApplicationId,
    userRepaymentStartDate: formatDate(item.userRepaymentStartDate),
    totalRepaymentAmount: formatCurrency(item.totalRepaymentAmount),
    weeklyRepaymentAmount: formatCurrency(item.weeklyRepaymentAmount),
    loanStatus: (
      <span
        className={`px-3 py-1 flex w-fit items-center gap-2 rounded-2xl  ${
          item.loanStatus === "Approved"
            ? "bg-[#34C7591F]  text-[#34C759]"
            : item.loanStatus === "Rejected"
            ? "bg-[#FB03001F]  text-[#FB0300]"
            : "bg-[#FF790C1F]  text-[#FF790C]"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            item.loanStatus === "Approved"
              ? "bg-[#34C759]"
              : item.loanStatus === "Rejected"
              ? "bg-[#FB0300]"
              : "bg-[#FF790C]"
          }`}
        ></div>{" "}
        {item.loanStatus}
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
        loading={isLoadingLoan}
      />

      <Drawer anchor="right" open={state}>
        <div className=" w-[100vw] relative max-w-[700px]">
          <div className=" p-4  bg-white  sticky top-0 flex justify-between mb-8 items-center ">
            <h2 className="text-[24px] font-[700]">Loan Details </h2>
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

                <div className="flex justify-center flex-wrap gap-4 items-center">
                  {loanPlan?.data?.isLoanEligibleForAdminApproval &&
                    loanPlan?.data?.isLoanEligibleForAdminApproval && (
                      <>
                        <button
                          onClick={() => handleOpen("Approval")}
                          className="flex my-6 justify-center min-w-[200px] items-center gap-6 px-6 py-3 rounded-xl text-[#fff] bg-primary "
                        >
                          {" "}
                          Approve
                        </button>

                        <button
                          onClick={() => handleOpen("Rejection")}
                          className="flex my-6 justify-center min-w-[200px] items-center gap-6 px-6 py-3 rounded-xl text-[#fff] bg-[#FB0300] "
                        >
                          {" "}
                          Reject
                        </button>
                      </>
                    )}

                  {loanPlan?.data?.loanStatus === "Approved" ? (
                    <button className="flex my-6 justify-center p-[8px] min-w-[200px] items-center gap-6  rounded-xl text-[#fff] bg-[#F8F8FA] ">
                      {" "}
                      <div className="text-[#FF770E] rounded-md px-6 py-1  w-full h-full bg-[#FF770E1A]">
                        In progress
                      </div>
                    </button>
                  ) : loanPlan?.data?.loanStatus === "Rejected" ? (
                    <button className="flex my-6 justify-center p-[8px] min-w-[200px] items-center gap-6  rounded-xl text-[#fff] bg-[#F8F8FA] ">
                      {" "}
                      <div className="text-[#FB0300] rounded-md px-6 py-1  w-full h-full bg-[#FB030029]">
                        Rejected
                      </div>
                    </button>
                  ) : loanPlan?.data?.loanStatus === "Completed" ? (
                    <button className="flex my-6 justify-center p-[8px] min-w-[200px] items-center gap-6  rounded-xl text-[#fff] bg-[#F8F8FA] ">
                      {" "}
                      <div className="text-[#34C759] rounded-md px-6 py-1  w-full h-full bg-[#34C75929]">
                        Completed
                      </div>
                    </button>
                  ) : loanPlan?.data?.loanStatus === "PendingApproval" ? (
                    <button className="flex my-6 justify-center p-[8px] min-w-[200px] items-center gap-6  rounded-xl text-[#fff] bg-[#F8F8FA] ">
                      {" "}
                      <div className="text-[#FF770E] rounded-md px-6 py-1  w-full h-full bg-[#FF770E1A]">
                        In progress
                      </div>
                    </button>
                  ) : null}
                </div>

                <div className="max-w-4xl mx-auto p-6">
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">
                      Personal Info
                    </h2>
                    <div className="grid grid-cols-3 gap-4">
                      <p className=" flex flex-col">
                        <strong>Name</strong> {loanPlan?.data?.fullName}
                      </p>
                      <p className=" flex flex-col">
                        <strong>Email</strong> {loanPlan?.data?.emailAddress}
                      </p>
                      <p className=" flex flex-col">
                        <strong>Phone No</strong> {loanPlan?.data?.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Plan Info</h2>
                    <div className="grid grid-cols-3 gap-4">
                      <p className=" flex flex-col">
                        <strong>Weekly Repayment</strong>{" "}
                        {loanPlan?.data?.weeklyRepaymentAmount}
                      </p>
                      <p className=" flex flex-col">
                        <strong>Target Amount</strong>{" "}
                        {formatCurrency(loanPlan?.data?.totalRepaymentAmount)}
                      </p>
                      <p className=" flex flex-col">
                        <strong>Start Date</strong>
                        {loanPlan?.data?.repaymentDurationInMonth}
                      </p>
                      <p className=" flex flex-col">
                        <strong>End Date</strong>
                        {loanPlan?.data?.endDate}
                      </p>
                      <p className=" flex flex-col">
                        <strong>Interest Payable</strong>
                        {formatCurrency(loanPlan?.data?.interestAmount)}
                      </p>
                      <p className=" flex flex-col">
                        <strong>Duration</strong>{" "}
                        {loanPlan?.data?.repaymentDurationInMonth} Months
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Guarantors</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <p className=" flex flex-col">
                        <strong>1st Guarantor</strong>{" "}
                        {loanPlan?.data?.guarantors[0].fullName} (
                        {loanPlan?.data?.guarantors[0].subscriptionCode}) <br />
                        ({loanPlan?.data?.guarantors[0].email})
                      </p>
                      <p className=" flex flex-col">
                        <strong>2nd Guarantor</strong>{" "}
                        {loanPlan?.data?.guarantors[1].fullName} (
                        {loanPlan?.data?.guarantors[1].subscriptionCode}) <br />
                        ({loanPlan?.data?.guarantors[1].email})
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-2">Reason</h2>
                    <p>{loanPlan?.data?.loanReason}</p>
                  </div>
                </div>

                <LoanTabs activities={loanPlan?.data?.activities} />
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
          <div className="flex justify-center items-center mb-4">
            <h2 className="text-xl font-semibold">
              Loan {modalType} Confirmation
            </h2>
          </div>

          <div>
            <p className="text-[#B0B0B0] my-4 text-center">
              Are you sure you want to{" "}
              {modalType === "Approval" ? "approve" : "reject"} this loan?
            </p>

            <div className="flex gap-4">
              <button
                onClick={handleClose}
                className="flex my-6 justify-center flex-1 p-[10px] min-w-[150px] items-center rounded-md text-[#000] bg-[#F8F8FA]"
              >
                No, I’m not
              </button>

              <button
                onClick={handleConfirmAction}
                className={`flex my-6 justify-center flex-1 p-[10px] min-w-[150px] items-center rounded-md text-[#fff] ${
                  modalType === "Approval" ? "bg-[#041F62]" : "bg-[#FB0300]"
                }`}
              >
                Yes, I am
              </button>
            </div>
          </div>
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

export default LoanManagement;
