import http from '@/configs/axios.config';

export const CalculatorProbability = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return await http.post('/naive_bayes', formData);
};
