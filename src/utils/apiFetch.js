/* global localStorage */
const axios = require("axios");

function getHeaders() {
  return { "Content-Type": "application/json" };
}
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  // timeout: 1000,
  headers: getHeaders(),
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return config;
  }
  if (config.url !== "v1/admin/notification" && config.method !== "post") {
    document.getElementById("loader").classList.remove("hidden");
  }

  config = {
    ...config,
    headers: { ...config.headers, Authorization: `Bearer ${token}` },
  };
  return config;
});

instance.interceptors.response.use(
  function (response) {
    // Do something with response data
    document.getElementById("loader").classList.add("hidden");
    return response;
  },
  function (error) {
    const { status } = error.response;
    if (status === 401 || status === 403 || status === 409) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("uniqueId");
      window.location = "/login";
    }
    return Promise.reject(error);
  }
);

function apiGet(url, params = {}) {
  return instance.get(url, { params });
}

function apiPost(url, body) {
  return instance.post(url, body);
}

function apiPut(url, body) {
  return instance.put(url, body);
}

function apiDelete(url) {
  return instance.delete(url);
}

export { getHeaders, apiGet, apiPost, apiPut, apiDelete };
