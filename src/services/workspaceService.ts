import { api } from "./api";
import { Workspace, WorkspaceType, Location, PageResponse } from "@/types";

export const workspaceService = {
  getWorkspaces: async (params?: {
    search?: string;
    typeId?: string;
    available?: boolean;
    page?: number;
    size?: number;
  }): Promise<PageResponse<Workspace>> => {
    const response = await api.get("/workspaces", { params: { ...params, limit: params?.size } });
    // Express returns: { success, data: { content, totalElements, ... } }
    return response.data.data;
  },

  getWorkspaceById: async (id: string): Promise<Workspace | null> => {
    if (!id) return null;
    try {
      const response = await api.get(`/workspaces/${id}`);
      return response.data?.data || null;
    } catch (err) {
      console.warn(`Workspace not found for id/slug: ${id}`);
      return null;
    }
  },

  getWorkspaceTypes: async (): Promise<WorkspaceType[]> => {
    try {
      const response = await api.get("/workspace-types");
      return response.data?.data || [];
    } catch {
      return [];
    }
  },
};

export const locationService = {
  getLocations: async (params?: {
    search?: string;
    city?: string;
    state?: string;
    area?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<Location>> => {
    try {
      const response = await api.get("/locations", { params: { ...params, limit: params?.size } });
      return response.data?.data || { content: [], totalElements: 0, totalPages: 0, number: 0 };
    } catch {
      return { content: [], totalElements: 0, totalPages: 0, number: 0 };
    }
  },

  getLocationById: async (id: string): Promise<Location | null> => {
    if (!id) return null;
    try {
      const response = await api.get(`/locations/${id}`);
      return response.data?.data || null;
    } catch (err) {
      console.warn(`Location not found for id/slug: ${id}`);
      return null;
    }
  },
};
