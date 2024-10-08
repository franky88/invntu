import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const GetAllUsers = async (): Promise<User[] | undefined> => {
  try {
    const response = await api.get("/users/all/");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const GetUser = async (id: number): Promise<User | undefined> => {
  try {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

export const PutUser = async (
  id: number,
  userData: FormData | Record<string, any>
): Promise<User | undefined> => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data", // or "application/json" if not sending a file
    },
    withCredentials: true,
  };
  try {
    const response = await api.put(`/users/${id}/`, userData, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

export const GetItems = async (): Promise<Item[] | undefined> => {
  try {
    const response = await api.get("/items/");
    const paginateData = response.data;
    const items = paginateData.results;
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const GetAllItems = async (
  page: number
): Promise<Item[] | undefined> => {
  try {
    const response = await api.get("/items/", { params: { page } });
    const paginateData = response.data;
    const items = paginateData.results;
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const GetAvailableItems = async (): Promise<Item[] | undefined> => {
  try {
    const response = await api.get("/items/available/");
    const paginateData = response.data;
    const items = paginateData.results;
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const GetItem = async (id: number): Promise<Item | undefined> => {
  try {
    const response = await api.get(`/items/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching item with ID ${id}:`, error);
    throw error; // Optionally rethrow or handle differently
  }
};

export const GetAllUnits = async (): Promise<Item[] | undefined> => {
  try {
    const response = await api.get("/units/");
    const paginateData = response.data;
    const items = paginateData.results;
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw error;
  }
};

export const GetKits = async (): Promise<Kit[] | undefined> => {
  try {
    const response = await api.get("/kits/");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching kits:", error);
    throw error; // Optionally rethrow or handle differently
  }
};

export const GetKit = async (id: number): Promise<Kit | undefined> => {
  try {
    const response = await api.get(`/kits/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching item with ID ${id}:`, error);
    throw error; // Optionally rethrow or handle differently
  }
};

export const GetDepartments = async (): Promise<Department[] | undefined> => {
  try {
    const response = await api.get("/departments/");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error; // Optionally rethrow or handle differently
  }
};

export const GetDepartment = async (
  id: number
): Promise<Department | undefined> => {
  try {
    const response = await api.get(`/departments/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching department with ID ${id}:`, error);
    throw error; // Optionally rethrow or handle differently
  }
};

export const GetUnitStatuses = async (): Promise<UnitStatus[] | undefined> => {
  try {
    const response = await api.get("/unit-status/");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching unit status:", error);
    throw error; // Optionally rethrow or handle differently
  }
};

export const GetUnitStatus = async (
  id: number
): Promise<UnitStatus | undefined> => {
  try {
    const response = await api.get(`/unit-status/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching unit status with ID ${id}:`, error);
    throw error; // Optionally rethrow or handle differently
  }
};

export const GetCategories = async (): Promise<Category[] | undefined> => {
  try {
    const response = await api.get("/categories/");
    return response.data.results;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; // Optionally rethrow or handle differently
  }
};

export const GetCategory = async (
  id: number
): Promise<Category | undefined> => {
  try {
    const response = await api.get(`/categories/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw error; // Optionally rethrow or handle differently
  }
};

export default api;
