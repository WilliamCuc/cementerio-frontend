export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const httpLogin = `${API_URL}/usuarios/login`;

export const httpGetUsuarios = `${API_URL}/usuarios`;
export const httpCrearUsuario = `${API_URL}/usuarios`;

export const httpGetDifuntos = `${API_URL}/difuntos`;
export const httpCrearDifunto = `${API_URL}/difuntos`;
export const httpEditarDifunto = `${API_URL}/difuntos`;
export const httpEliminarDifunto = `${API_URL}/difuntos`;

export const httpGetEncargados = `${API_URL}/encargados`;
export const httpCrearEncargado = `${API_URL}/encargados`;
export const httpEditarEncargado = `${API_URL}/encargados`;
export const httpEliminarEncargado = `${API_URL}/encargados`;
