import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy loading route components
const UserRoutes = React.lazy(() => import("./routes/UserRoutes"));
const AdminRoutes = React.lazy(() => import("./routes/AdminRoutes"));
const Home = React.lazy(() => import("./pages/Home"));
import { Button, Typography, ThemeProvider, createTheme } from "@mui/material";

const Fallback = () => <div>Loading...</div>; // Custom fallback loader

export const LazyRoute = ({ Component }) => (
  <React.Suspense fallback={<Fallback />}>
    <Component />
  </React.Suspense>
);

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Customize primary color
    },
    secondary: {
      main: "#dc004e", // Customize secondary color
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Home route */}
          <Route path="/" element={<LazyRoute Component={Home} />} />

          {/* User and Admin routes */}
          <Route path="user/*" element={<UserRoutes />} />
          <Route path="admin/*" element={<AdminRoutes />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
