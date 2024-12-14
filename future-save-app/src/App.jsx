import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy loading route components
const UserRoutes = React.lazy(() => import("./routes/UserRoutes"));
const AdminRoutes = React.lazy(() => import("./routes/AdminRoutes"));
const Home = React.lazy(() => import("./pages/Home"));

const Fallback = () => <div>Loading...</div>; // Custom fallback loader

export const LazyRoute = ({ Component }) => (
  <React.Suspense fallback={<Fallback />}>
    <Component />
  </React.Suspense>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<LazyRoute Component={Home} />} />

        {/* User and Admin routes */}
        <Route path="user/*" element={<LazyRoute Component={UserRoutes} />} />
        <Route path="admin/*" element={<LazyRoute Component={AdminRoutes} />} />
      </Routes>
    </Router>
  );
}

export default App;
