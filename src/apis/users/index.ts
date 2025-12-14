import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "../client";
import { setCookie, deleteCookie } from "../../utils/cookies";
import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  User,
  UpdateProfileRequest,
} from "./types";

// API Functions
const register = async (data: RegisterRequest): Promise<void> => {
  await instance.post("/users/register", data);
};

const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await instance.post<LoginResponse>("/users/login", data);
  return response.data;
};

const getMe = async (): Promise<User> => {
  const response = await instance.get<User>("/users/me");
  return response.data;
};

const updateProfile = async (data: UpdateProfileRequest): Promise<void> => {
  await instance.patch("/users/me", data);
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

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });
};

export const logout = () => {
  deleteCookie("accessToken");
  deleteCookie("refreshToken");
};
