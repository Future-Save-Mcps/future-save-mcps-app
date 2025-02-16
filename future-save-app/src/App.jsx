import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Loader.css";

const UserRoutes = React.lazy(() => import("./routes/UserRoutes"));
const AdminRoutes = React.lazy(() => import("./routes/AdminRoutes"));
const Home = React.lazy(() => import("./pages/Home"));
import { Provider } from "react-redux";
const Login = React.lazy(() => import("./pages/Login"));
import { ThemeProvider, createTheme } from "@mui/material";
import { store } from "./app/store";
import ProtectedRoute from "./components/ProtectedRoute";

const Loader = () => {
  return <span className="loader"></span>;
};

export const Fallback = () => (
  <div className="flex-1 bg-white flex justify-center items-center min-h-[70vh] h-[100%]w-[100%]">
    <Loader />
  </div>
);
export const LazyRoute = ({ Component }) => (
  <ProtectedRoute>
    <React.Suspense fallback={<Fallback />}>
      <Component />
    </React.Suspense>
  </ProtectedRoute>
);

export const NonProtectedLazyRoute = ({ Component }) => (
  <React.Suspense fallback={<Fallback />}>
    <Component />
  </React.Suspense>
);

const theme = createTheme({
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
            border: "none",
          },
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          "&:focus": {
            outline: "none",
            border: "none",
          },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 0, 0, 0.24)",
          backdropFilter: "blur(8px)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:focus-within": {
            outline: "none",
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            {/* Home route */}
            <Route
              path="/"
              element={<NonProtectedLazyRoute Component={Login} />}
            />
            <Route
              path="/register"
              element={<NonProtectedLazyRoute Component={Home} />}
            />

            {/* User and Admin routes */}
            <Route path="user/*" element={<UserRoutes />} />
            <Route path="admin/*" element={<AdminRoutes />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
