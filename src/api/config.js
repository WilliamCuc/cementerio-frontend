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

export const httpGetLocaciones = `${API_URL}/locaciones`;
export const httpGetTodasLocaciones = `${API_URL}/locaciones/todas`;
export const httpCrearLocacion = `${API_URL}/locaciones`;
export const httpEditarLocacion = `${API_URL}/locaciones`;
export const httpEliminarLocacion = `${API_URL}/locaciones`;

export const httpGetPanteones = `${API_URL}/panteones`;
export const httpGetTodosPanteones = `${API_URL}/panteones/todos`;
export const httpCrearPanteon = `${API_URL}/panteones`;
export const httpEditarPanteon = `${API_URL}/panteones`;
export const httpEliminarPanteon = `${API_URL}/panteones`;

export const httpGetEspacios = `${API_URL}/espacios`;
export const httpGetEspaciosDisponibles = `${API_URL}/espacios/disponibles`;
export const httpCrearEspacio = `${API_URL}/espacios`;
export const httpEditarEspacio = `${API_URL}/espacios`;
export const httpEliminarEspacio = `${API_URL}/espacios`;

export const httpGetEstados = `${API_URL}/estados`;