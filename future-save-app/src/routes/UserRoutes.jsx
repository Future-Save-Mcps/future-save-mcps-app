import React from "react";
import { Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import { LazyRoute } from "../App";
import ProtectedRoute from "../components/ProtectedRoute";

const Dashboard = React.lazy(() => import("../pages/users/Dashboard"));
const Account = React.lazy(() => import("../pages/users/Account"));
const ContributionPplan = React.lazy(() =>
  import("../pages/users/ContributionPplan")
);
const LoanManagement = React.lazy(() =>
  import("../pages/users/LoanManagement")
);

const UserRoutes = () => (
  <Routes>
    <Route path="/" element={<UserLayout />}>
      <Route index element={
          <ProtectedRoute>
             <LazyRoute Component={Dashboard} />
          </ProtectedRoute>
       } />
      <Route
        path="contribution_plan"
        element={<LazyRoute Component={ContributionPplan} />}
      />
      <Route
        path="loan_management"
        element={<LazyRoute Component={LoanManagement} />}
      />
      <Route path="account" element={<LazyRoute Component={Account} />} />
    </Route>
  </Routes>
);

export default UserRoutes;
