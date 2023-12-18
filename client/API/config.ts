import axios from 'axios';

export const ServerAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  // withCredentials: true,
  // headers: {
  //   'Content-Type': 'application/json',
  //   'Access-Control-Allow-Origin': '*',
  // },
});

// ServerAxiosInstance.interceptors.request.use((req) => {
//   const token = localStorage.getItem("accessToken");
//   if (token && req.headers) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }

//   return req;
// });

// export const AppAxiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_APP_URL,
// });
