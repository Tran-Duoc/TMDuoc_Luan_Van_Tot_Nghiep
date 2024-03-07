import http from '@/configs/axios.config';
import axios from 'axios';

export type KnnPredictionType = {
  file: File;
  k_nearest: number;
  distance_calculation: string;
};

export const KNN_PREDICTION = async (
  data: Omit<KnnPredictionType, 'distance_calculation'>
) => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('k_nearest', String(data.k_nearest));
  return await http.post('/knn-prediction-nominal', formData);
};

export const KNN_PREDICTION_CONTINUES = async (data: KnnPredictionType) => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('k_nearest', String(data.k_nearest));
  formData.append('distance_calculation', data.distance_calculation);
  return await http.post('/knn-prediction', formData);
};
