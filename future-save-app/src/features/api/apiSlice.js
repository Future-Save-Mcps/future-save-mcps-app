import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getTokens, setTokens, clearTokens } from "../../utils/tokenManager";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://16.170.252.150:5000/api/",
  prepareHeaders: (headers, { getState }) => {
    const { accessToken } = getTokens();
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log(result);

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery(
      {
        url: "auth/refresh",
        method: "POST",
        body: { refreshToken: getTokens().refreshToken },
      },
      api,
      extraOptions
    );
    if (refreshResult.data) {
      // Store the new token
      setTokens(
        refreshResult.data.accessToken,
        refreshResult.data.refreshToken
      );
      // Retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      clearTokens();
    }
  }
  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          setTokens(data.accessToken, data.refreshToken);
        } catch (err) {
          console.error(err);
          // Handle error
        }
      },
    }),
    postData: builder.mutation({
      query: ({ url, data }) => ({
        url,
        method: "POST",
        body: data,
      }),
    }),
    getData: builder.query({
      query: ({ url, params }) => ({
        url,
        method: "GET",
        params,
      }),
    }),

    patchData: builder.mutation({
      query: ({ url, data }) => ({
        url,
        method: "PATCH",
        body: data,
      }),
    }),
    // remaining slice for delete
  }),
});

export const {
  useLoginMutation,
  usePostDataMutation,
  useGetDataQuery,
  usePatchDataMutation,
} = api;

// export const api = createApi({
//   baseQuery: baseQueryWithReauth,
//   endpoints: (builder) => ({
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: "auth/login",
//         method: "POST",
//         body: credentials,
//       }),
//       onQueryStarted: async (_, { queryFulfilled }) => {
//         try {
//           const { data } = await queryFulfilled;
//           setTokens(data.accessToken, data.refreshToken);
//         } catch (err) {
//           console.error(err);
//         }
//       },
//     }),
//     postData: builder.mutation({
//       query: ({ url, data }) => ({
//         url,
//         method: "POST",
//         body: data,
//       }),
//     }),
//     getData: builder.query({
//       query: ({ url, params }) => ({
//         url,
//         method: "GET",
//         params,
//       }),
//     }),
//     patchData: builder.mutation({
//       query: ({ url, data }) => ({
//         url,
//         method: "PATCH",
//         body: data,
//       }),
//     }),
//     // remaining slice for delete
//   }),
// });

// export const {
//   useLoginMutation,
//   usePostDataMutation,
//   useGetDataQuery,
//   usePatchDataMutation,
// } = api;
