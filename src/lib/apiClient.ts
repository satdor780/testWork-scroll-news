import axios, { AxiosError } from "axios";
import type { ApiError } from "../types/api";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const USER_UUID = process.env.EXPO_PUBLIC_USER_UUID;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${USER_UUID}`,
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const serverMessage = error.response?.data?.error?.message;
    const serverCode = error.response?.data?.error?.code;

    const enriched = new Error(serverMessage ?? error.message) as Error & {
      code: string | undefined;
      status: number | undefined;
    };
    enriched.code = serverCode;
    enriched.status = error.response?.status;

    return Promise.reject(enriched);
  },
);

apiClient.interceptors.request.use((config) => {
  return config;
});
