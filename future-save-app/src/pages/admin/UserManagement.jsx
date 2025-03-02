import AddUser from "@/components/AddUser";
import AdminTableComponent from "@/components/AdminTableComponent";
import SuccessModal from "@/components/SuccessModal";
import { useApiGet } from "@/hooks/useApi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const navigate = useNavigate();

  const {
    data: loan,
    isLoading: isLoadingLoan,
    refetch: refetchLoan,
  } = useApiGet(`admin/user-management-all-users`);


  const handleUserAdded = () => {
    setIsModalOpen(false);
    setIsSuccessOpen(true);
    // setTimeout(() => setIsSuccessOpen(false), 4000);
  };

  console.log(loan);
  const tableHeaders = [
    { label: "Name", value: "firstName" },
    { label: "Email Address", value: "email" },
    { label: "Phone Number", value: "phoneNumber" },
    // { label: "Last login", value: "userRepaymentStartDate" },
    // { label: "Weekly Amount", value: "weeklyAmount" },
    { label: "Account Status", value: "isActive" },
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
      id: 3,
      name: "Williams Elum",
      plan: "Premium Loan",
      targetAmount: "₦ 300,000.00",
      dateCreated: "12/05/2025",
      weeklyAmount: "₦ 5,000.00",
      status: "Pending",
    },
  ];

  const tableData = loan?.data?.items.map((item) => ({
    ...item,
    isActive: (
      <span
        className={`px-3 py-1 flex w-fit items-center gap-2 rounded-2xl  ${
          item.isActive === true
            ? "bg-[#34C7591F]  text-[#34C759]"
            // : item.isActive === "Rejected"
            // ? "bg-[#FB03001F]  text-[#FB0300]"
            : "bg-[#F7F7F7]  text-[#939393]"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            item.isActive === true
              ? "bg-[#34C759]"
              // : item.isActive === "Rejected"
              // ? "bg-[#FB0300]"
              : "bg-[#939393]"
          }`}
        ></div>
        {item.isActive? "Active" : "InActive"}
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

  const toggleDrawer =
    (open, id = null) =>
    (event) => {
      if (
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      console.log("btn clicked", id);
      navigate(`/admin/user_management/${id}`, { state: id });
    };

  // const userDetails = (user) => {
  //   navigate(`/admin/user-management/${user.id}`, { state: user });
  // };

  // Audit Trail Function (Dummy Example)
  const handleAuditTrail = () => {
    console.log("Viewing audit trail...");
  };
  const handleAddUser = () => {
    setIsModalOpen(true); // Open the modal
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
        onAddUser={handleAddUser} // Function to handle adding a user
        showAddUserButton={true}
      />

      {isModalOpen && (
        <AddUser
          open={isModalOpen}
          setOpen={setIsModalOpen}
          onUserAdded={handleUserAdded}
        />
      )}

      {isSuccessOpen && (
        <SuccessModal open={isSuccessOpen} setOpen={setIsSuccessOpen} />
      )}
    </div>
  );
};

export default UserManagement;
