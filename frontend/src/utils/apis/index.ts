import http from "@/config/axios";

export const testApiWorking = async () => {
  return await http.get("/test_api");
};
