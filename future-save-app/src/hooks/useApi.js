import { useCallback } from "react";
import {
  useLoginMutation,
  usePostDataMutation,
} from "../features/api/apiSlice";
import { toast } from "react-toastify";
import { handleError } from "../utils/handleError";

export const useApiLogin = () => {
  const [login, { isLoading, isError, error }] = useLoginMutation();

  const loginUser = useCallback(
    async (credentials) => {
      try {
        const result = await login(credentials).unwrap();
        toast.success("Login successful!", {
          style: { background: "#FFA500", color: "white" },
        });
        return result;
      } catch (err) {
        return handleError(err);
      }
    },
    [login]
  );

  return { loginUser, isLoading, isError, error };
};

export const useApiPost = () => {
  const [trigger, { isLoading, isError, error }] = usePostDataMutation();

  const post = useCallback(
    async (url, data) => {
      try {
        const result = await trigger({ url, data }).unwrap();
        toast.success("Operation successful!", {
          style: { background: "#FFA500", color: "white" },
        });
        return result;
      } catch (err) {
        return handleError(err);
      }
    },
    [trigger]
  );

  return { post, isLoading, isError, error };
};



export const useApiGet = () => {
  const { data, error, isLoading, refetch } = useGetDataQuery();

  const get = useCallback(
    async (url, params) => {
      try {
        const result = await refetch({ url, params });
        toast.success("Data retrieved successfully!", {
          style: { background: "#FFA500", color: "white" },
        });
        return result;
      } catch (err) {
        return handleError(err);
      }
    },
    [refetch]
  );

  return { get, data, isLoading, error, refetch };
};

// Add similar hooks for GET, DELETE, and UPDATE operations as needed
