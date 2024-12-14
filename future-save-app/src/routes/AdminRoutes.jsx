import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { LazyRoute } from "../App";

const Dashboard = React.lazy(() => import("../pages/admin/Dashboard"));
const Settings = React.lazy(() => import("../pages/admin/Settings"));

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminLayout />}>
      <Route index element={<LazyRoute Component={Dashboard} />} />
      <Route path="settings" element={<LazyRoute Component={Settings} />} />
    </Route>
  </Routes>
);

export default AdminRoutes;
