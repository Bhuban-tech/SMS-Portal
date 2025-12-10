export const API_BASE_URL = "http://192.168.110.238:8080";

export const ENDPOINTS = {
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  DELIVERY_REPORTS : (id) => `/api/message_recipients/${id}/delivery_reports`,

};
