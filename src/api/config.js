export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const httpLogin = `${API_URL}/usuarios/login`;
export const httpGetUsuarios = `${API_URL}/usuarios`;
export const httpCrearUsuario = `${API_URL}/usuarios`;
