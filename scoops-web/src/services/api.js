import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("scoops_token");

    // Log para depuração: verifique se o token está saindo do navegador
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token anexado à requisição:", config.url);
    } else {
      console.warn("Nenhum token encontrado no localStorage!");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
