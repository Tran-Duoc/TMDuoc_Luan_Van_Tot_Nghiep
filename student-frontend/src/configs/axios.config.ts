import axios, { AxiosInstance } from 'axios';

class Http {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      // baseURL: 'https://tran-minh-backend-student.hf.space',
      baseURL: 'http://localhost:8000',
      timeout: 10 * 1000, //10s
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

const http = new Http().instance;
export default http;
