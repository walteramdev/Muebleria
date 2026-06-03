import { API_BASE_URL } from "../config";
const BASE_URL = `${API_BASE_URL}/categories`;

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.message || "Error en la petición");
  }
  return data;
};

export const getCategories = async () => {
  const response = await fetch(BASE_URL);
  return await handleResponse(response);
};

export const createCategory = async (categoryData) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
    credentials: "include",
  });
  return await handleResponse(response);
};

export const updateCategory = async (id, categoryData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
    credentials: "include",
  });
  return await handleResponse(response);
};

export const deleteCategory = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return await handleResponse(response);
};
