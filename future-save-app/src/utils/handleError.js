import { toast } from "react-toastify";

export const handleError = (error) => {
  console.error("API Error:", error);

  if (error?.name === "TypeError" && error?.message === "Failed to fetch") {
    toast.error(
      "Unable to reach the server. Please check your internet connection or try again later.",
      {
        style: { background: "#fff", color: "#000" },
      }
    );
    return "NETWORK_ERROR";
  }

  if (error?.status === "FETCH_ERROR") {
    toast.error(
      "Unable to reach the server. Please try again later or contact support.",
      {
        style: { background: "#fff", color: "#000" },
      }
    );
    return "FETCH_ERROR";
  }

  if (error?.status === 401) {
    toast.error("Authentication failed. Please log in again.", {
      style: { background: "#fff", color: "#000" },
    });
    return "AUTH_ERROR";
  }

  if (error?.status === 403) {
    toast.error("You do not have permission to perform this action.", {
      style: { background: "#fff", color: "#000" },
    });
    return "PERMISSION_ERROR";
  }

  if (error?.status >= 500) {
    toast.error("A server error occurred. Please try again later.", {
      style: { background: "#fff", color: "#000" },
    });
    return "SERVER_ERROR";
  }

  toast.error(
    error?.data?.message || "An unexpected error occurred. Please try again.",
    {
      style: { background: "#fff", color: "#000" },
    }
  );
  return "UNKNOWN_ERROR";
};
