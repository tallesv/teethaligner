import axios, { AxiosInstance } from 'axios';

export default function getApiClient(token?: string): AxiosInstance {
  const api = axios.create({
    baseURL: `https://teeth-aligners-api.fly.dev/api/v1`,
  });

  api.defaults.headers.common.Accept = 'application/json';

  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  return api;
}
