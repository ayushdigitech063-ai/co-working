import { api } from "./api";

export const bookingService = {
  create: async (data: { workspaceId: string; startDate: string; endDate: string; notes?: string }) => {
    const res = await api.post("/bookings", data);
    return res.data.data;
  },
  getMyBookings: async (params?: { status?: string; page?: number; limit?: number }) => {
    const res = await api.get("/bookings/my", { params });
    return res.data.data;
  },
  cancel: async (id: string) => {
    const res = await api.delete(`/bookings/${id}`);
    return res.data;
  },
  // Admin
  getAllBookings: async (params?: { status?: string; page?: number; limit?: number }) => {
    const res = await api.get("/bookings", { params });
    return res.data.data;
  },
  updateStatus: async (id: string, data: { status?: string; paymentStatus?: string }) => {
    const res = await api.patch(`/bookings/${id}/status`, data);
    return res.data.data;
  },
  getStats: async () => {
    const res = await api.get("/bookings/stats");
    return res.data.data;
  },
};

export const leadService = {
  submit: async (data: { name: string; email: string; phone?: string; message: string; workspaceId?: string; locationId?: string }) => {
    const res = await api.post("/leads", data);
    return res.data;
  },
  getAll: async (params?: { status?: string; page?: number }) => {
    const res = await api.get("/leads", { params });
    return res.data.data;
  },
};

export const reviewService = {
  submit: async (data: { workspaceId: string; rating: number; comment?: string }) => {
    const res = await api.post("/reviews", data);
    return res.data.data;
  },
  getForWorkspace: async (workspaceId: string) => {
    if (!workspaceId) return { reviews: [], averageRating: 0, totalReviews: 0 };
    try {
      const res = await api.get(`/reviews/workspace/${workspaceId}`);
      return res.data?.data || { reviews: [], averageRating: 0, totalReviews: 0 };
    } catch {
      return { reviews: [], averageRating: 0, totalReviews: 0 };
    }
  },
};
