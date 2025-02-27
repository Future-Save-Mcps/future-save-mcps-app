import AdminTableComponent from "@/components/AdminTableComponent";
import React from "react";

const UserManagement = () => {
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
const handleAddUser = ( ) => {
  console.log("Adding user...");
}
  return (
    <div>
      <AdminTableComponent
        headers={tableHeaders}
        data={tableData}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onExport={handleExport}
        onAuditTrail={handleAuditTrail}
        onAddUser={handleAddUser} // Function to handle adding a user
        showAddUserButton={true}
      />
    </div>
  );
};

export default UserManagement;
