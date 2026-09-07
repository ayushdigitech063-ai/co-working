import { api } from "./api";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  register: async (data: { name: string; email: string; password: string; phone?: string }): Promise<AuthResponse> => {
    const res = await api.post("/auth/register", data);
    return res.data.data;
  },
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post("/auth/login", data);
    return res.data.data;
  },
  getMe: async (): Promise<AuthUser> => {
    const res = await api.get("/auth/me");
    return res.data.data;
  },
  updateMe: async (data: { name?: string; phone?: string }): Promise<AuthUser> => {
    const res = await api.put("/auth/me", data);
    return res.data.data;
  },
  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.put("/auth/change-password", data);
  },
};
