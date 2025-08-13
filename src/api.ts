// src/api.ts
import { useAuth } from "./hooks/useAuth";
import axios from 'axios';

const API = "http://localhost:8072/api/v1/users";

// Hook để sử dụng trong components
export const useApi = () => {
  const { getToken } = useAuth();

  const getPublic = async () => {
    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await axios.get(`${API}/public`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };

  const getSecure = async () => {
    const token = await getToken();
    if (!token) throw new Error("No token");

    const response = await axios.get(`${API}/secure`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  };

  return {
    getPublic,
    getSecure,
  };
};

// Standalone functions (for backward compatibility)
export async function getPublic() {
  // This function now requires useAuth hook to be used in components
  throw new Error("Please use useApi() hook in components instead of calling this function directly");
}

export async function getSecure() {
  // This function now requires useAuth hook to be used in components
  throw new Error("Please use useApi() hook in components instead of calling this function directly");
}
