import { useCallback } from "react";
import {
  useInitiateLoginMutation,
  useCompleteLoginMutation,
  usePostDataMutation,
  useGetDataQuery,
  usePatchDataMutation,
  useDeleteDataMutation,
} from "../features/api/apiSlice";
import { toast } from "react-toastify";
import { handleError } from "../utils/handleError";

export const useApiLogin = () => {
  const [
    initiateLogin,
    {
      isLoading: isInitiateLoading,
      isError: isInitiateError,
      error: initiateError,
    },
  ] = useInitiateLoginMutation();
  const [
    completeLogin,
    {
      isLoading: isCompleteLoading,
      isError: isCompleteError,
      error: completeError,
    },
  ] = useCompleteLoginMutation();

  const login = useCallback(
    async (credentials) => {
      try {
        const initiateResult = await initiateLogin(credentials).unwrap();
        // toast.info("Verification code sent to your email!");
        return initiateResult;
      } catch (err) {
        return handleError(err);
      }
    },
    [initiateLogin]
  );

  const verifyOtp = useCallback(
    async (emailAddress, otp) => {
      try {
        const result = await completeLogin({ emailAddress, otp }).unwrap();
        if (result.success) {
          toast.info("Login successful!");
        }
        return result;
      } catch (err) {
        return handleError(err);
      }
    },
    [completeLogin]
  );

  return {
    login,
    verifyOtp,
    isInitiateLoading,
    isInitiateError,
    initiateError,
    isCompleteLoading,
    isCompleteError,
    completeError,
  };
};

export const useApiPost = () => {
  const [trigger, { isLoading, isError, error, }] = usePostDataMutation();

  const post = useCallback(
    async (url, data) => {
      try {
        const result = await trigger({ url, data }).unwrap();
        toast.info("Operation successful!");
        return result;
      } catch (err) {
        return handleError(err);
      }
    },
    [trigger]
  );

  return { post, isLoading, isError, error };
};

// export const useApiGet = () => {
//   const [trigger] = useGetDataQuery();

//   const get = useCallback(
//     async (url, params) => {
//       try {
//         const result = await trigger({ url, params }).unwrap();
//         return result;
//       } catch (err) {
//         return handleError(err);
//       }
//     },
//     [trigger]
//   );

//   return { get };
// };

export const useApiGet = (url, params) => {
  const { data, error, isLoading, refetch, isFetching } = useGetDataQuery({ url, params });

  const get = async () => {
    try {
      await refetch();
      return data;
    } catch (err) {
      return handleError(err);
    }
  };

  return { data, isLoading, error, refetch, get, isFetching };
};

export const useApiPatch = () => {
  const [trigger, { isLoading, isError, error }] = usePatchDataMutation();

  const patch = useCallback(
    async (url, data) => {
      try {
        const result = await trigger({ url, data }).unwrap();
        toast.info("Update successful!");
        return result;
      } catch (err) {
        return handleError(err);
      }
    },
    [trigger]
  );

  return { patch, isLoading, isError, error };
};

export const useApiDelete = () => {
  const [trigger, { isLoading, isError, error }] = useDeleteDataMutation();

  const deleteData = useCallback(
    async (url) => {
      try {
        const result = await trigger({ url }).unwrap();
        toast.info("Delete successful!");
        return result;
      } catch (err) {
        return handleError(err);
      }
    },
    [trigger]
  );

  return { deleteData, isLoading, isError, error };
};
