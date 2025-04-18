import { Navigate, useLocation } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const isAuthenticated = checkUserAuthentication() // You need to implement this function

  if (!isAuthenticated) {
    // Redirect them to the login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}

// This function should check if the user is authenticated
// You need to implement this based on your authentication system
function checkUserAuthentication() {
  // For example, you might check for a token in localStorage
  const token = localStorage.getItem("accessToken")
  return !!token // Returns true if token exists, false otherwise
}

export default ProtectedRoute

