import http from '@/configs/axios.config';

import { Params } from 'react-router-dom';

export const getExerciseByClassId = async (params: Params<string>) => {
  return await http.get(`/file/${params.id}`);
};

export const createExercise = async (
  files: File[],
  class_id: string,
  title: string,
  description: string
) => {
  const formData = new FormData();
  formData.append('class_id', class_id);
  formData.append('title', title);
  formData.append('description', String(description));
  files.forEach((file) => {
    formData.append('files', file);
  });

  return await http.post('/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const getExercise = async (param: Params<string>) => {
  return await http.get(`/file/exercise/${param.id}`);
};
