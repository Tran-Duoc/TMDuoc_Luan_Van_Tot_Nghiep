import { BASE_URL } from "@/constants/base-url";
import axios, { AxiosInstance } from "axios";

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 60 * 1000, // 60 seconds
    });
  }
}

const http = new Http().instance;
export default http;
