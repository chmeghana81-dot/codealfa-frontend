// import axios from "axios";

// const API = axios.create({
//   baseURL: "https://{import.meta.env.VITE_API_URL}/api/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "https://{import.meta.env.VITE_API_URL}/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;