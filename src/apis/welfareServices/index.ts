import { useQuery } from "@tanstack/react-query";
import { instance2 } from "../client";
import type { WelfareService } from "./types";

// API Functions
const getWelfareService = async (
  serviceId: string
): Promise<WelfareService> => {
  const response = await instance2.get<WelfareService>(
    `/welfare-services/${serviceId}`
  );
  return response.data;
};

// React Query Hooks
export const useWelfareService = (serviceId: string) => {
  return useQuery({
    queryKey: ["welfareServices", serviceId],
    queryFn: () => getWelfareService(serviceId),
    enabled: !!serviceId,
  });
};
