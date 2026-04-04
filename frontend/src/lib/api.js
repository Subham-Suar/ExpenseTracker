import axios from "axios";
import { loadSession } from "./session";

const defaultApiBase =
  import.meta.env.DEV && !import.meta.env.VITE_API_URL
    ? "/api"
    : import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: defaultApiBase,
});

api.interceptors.request.use((config) => {
  const session = loadSession();

  if (session.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }

  return config;
});

export function getApiError(error, fallbackMessage = "Something went wrong") {
  return error?.response?.data?.message || error?.message || fallbackMessage;
}

export async function loginUser(payload) {
  const { data } = await api.post("/user/login", payload);
  return data;
}

export async function registerUser(payload) {
  const { data } = await api.post("/user/register", payload);
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get("/user/me");
  return data;
}

export async function updateProfile(payload) {
  const { data } = await api.put("/user/profile", payload);
  return data;
}

export async function updatePassword(payload) {
  const { data } = await api.put("/user/password", payload);
  return data;
}

export async function getDashboardOverview() {
  const { data } = await api.get("/dashboard");
  return data;
}

export async function getIncomes() {
  const { data } = await api.get("/income/get");
  return data?.data ?? data;
}

export async function createIncome(payload) {
  const { data } = await api.post("/income/add", payload);
  return data;
}

export async function updateIncome(id, payload) {
  const { data } = await api.put(`/income/update/${id}`, payload);
  return data;
}

export async function deleteIncome(id) {
  const { data } = await api.delete(`/income/delete/${id}`);
  return data;
}

export async function getExpenses() {
  const { data } = await api.get("/expense/get");
  return data?.data ?? data;
}

export async function createExpense(payload) {
  const { data } = await api.post("/expense/add", payload);
  return data;
}

export async function updateExpense(id, payload) {
  const { data } = await api.put(`/expense/update/${id}`, payload);
  return data;
}

export async function deleteExpense(id) {
  const { data } = await api.delete(`/expense/delete/${id}`);
  return data;
}

export async function sendExpenseExport(range) {
  const { data } = await api.post(`/expense/sendexcel`, { range });
  return data;
}

export default api;
