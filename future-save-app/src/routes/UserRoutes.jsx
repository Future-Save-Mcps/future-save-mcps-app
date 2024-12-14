import React from "react";
import { Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";

const Dashboard = React.lazy(() => import("../pages/users/Dashboard"));
const Profile = React.lazy(() => import("../pages/users/Profile"));

const Fallback = () => <div>Loading...</div>;

const LazyRoute = ({ Component }) => (
  <React.Suspense fallback={<Fallback />}>
    <Component />
  </React.Suspense>
);

const UserRoutes = () => (
  <Routes>
    <Route path="/" element={<UserLayout />}>
      <Route index element={<LazyRoute Component={Dashboard} />} />
      <Route path="profile" element={<LazyRoute Component={Profile} />} />
    </Route>
  </Routes>
);

export default UserRoutes;
