import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { LazyRoute } from "../App";

const Dashboard = React.lazy(() => import("../pages/admin/Dashboard"));
const Settings = React.lazy(() => import("../pages/admin/Settings"));
const UserManagement = React.lazy(() => import("../pages/admin/UserManagement"));
const SavingsManagement = React.lazy(() => import("../pages/admin/SavingsManagement"));
const LoanManagement = React.lazy(() => import("../pages/admin/LoanManagement"));
const UserDetails = React.lazy(() => import("../pages/admin/UserDetails"))
const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminLayout />}>
      <Route index element={<LazyRoute Component={Dashboard} />} />
      <Route path="settings" element={<LazyRoute Component={Settings} />} />
      <Route path="user_management" element={<LazyRoute Component={UserManagement} />} />
      <Route path="user-management/:id" element={<UserDetails />} />
      <Route path="savings_management" element={<LazyRoute Component={SavingsManagement} />} />
      <Route path="loan_management" element={<LazyRoute Component={LoanManagement} />} />

    </Route>
  </Routes>
);

export default AdminRoutes;
