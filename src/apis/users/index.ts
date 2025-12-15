import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { setCookie, deleteCookie } from "../../utils/cookies";
import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  User,
  UpdateProfileRequest,
} from "./types";
import { instance2 } from "../client";

// API Functions
const register = async (data: RegisterRequest): Promise<void> => {
  await instance2.post("/users/register", data);
};

const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await instance2.post<LoginResponse>("/users/login", data);
  return response.data;
};

const getMe = async (): Promise<User> => {
  const response = await instance2.get<User>("/users/me");
  return response.data;
};

const updateMe = async (data: UpdateProfileRequest): Promise<User> => {
  const response = await instance2.patch<User>("/users/me", data);
  return response.data;
};

// React Query Hooks
export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setCookie("accessToken", data.access_token, 7);
      setCookie("refreshToken", data.refresh_token, 30);
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: getMe,
  });
};

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};

export const logout = () => {
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
};
