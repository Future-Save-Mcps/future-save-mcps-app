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
        toast.info("Login successful!", {
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
        toast.info(" successful!", {
          // style: { background: "#FFA500", color: "white" },
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
        toast.info("Data retrieved successfully!", {
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

export const useApiPatch = () => {
  const [trigger, { isLoading, isError, error }] = usePatchDataMutation();

  const patch = useCallback(
    async (url, data) => {
      try {
        const result = await trigger({ url, data }).unwrap();
        toast.info("Update successful!", {
          style: { background: "#FFA500", color: "white" },
        });
        return result;
      } catch (err) {
        return handleError(err);
      }
    },
    [trigger]
  );

  return { patch, isLoading, isError, error };
};
// remaining hook for delete
