import { API_BASE_URL } from "../config";
const BASE_URL = `${API_BASE_URL}/products`;

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error en la petición");
  }

  return data;
};

export const getAllProducts = async () => {
  const response = await fetch(BASE_URL);
  const data = await handleResponse(response);

  return data.products;
};

export const getProductById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  const data = await handleResponse(response);

  return data.product || data.products?.[0];
};

// Obtener productos con filtros (opcional)
// export const getProductsWithFilters = async (filters = {}) => {
//   const queryParams = new URLSearchParams(filters).toString()
//   const response = await fetch(`${BASE_URL}?${queryParams}`)
//   const data = await handleResponse(response)

//   return data.products
// }
