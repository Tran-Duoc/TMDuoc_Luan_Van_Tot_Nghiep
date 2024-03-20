import http from '@/configs/axios.config';

export const getAllClass = async () => {
  return await http.get('/class');
};

export const createClass = async (class_name: string) => {
  return await http.post('/class', {
    class_name: class_name,
  });
};
