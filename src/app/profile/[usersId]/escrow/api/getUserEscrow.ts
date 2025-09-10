import apiService from "@/lib/service/apiService";
import { EscrowQueryParams, EscrowUserResponse } from "../types/escrow";

export default async function getUserEscrows(params: EscrowQueryParams) {
  const { response } = await apiService<EscrowUserResponse>({
    endpoint: "/api/escrow/get-escrow",
    method: "GET",
    requiresAuth: true,
    params: params as Record<string, string | number | boolean>,
  });
  return response.data;
}