import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL
console.log(apiUrl)



const API = axios.create({
  baseURL:apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (
      typeof FormData !== "undefined" &&
      config.data instanceof FormData
    ) {
      if (typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
      } else {
        delete config.headers["Content-Type"];
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
