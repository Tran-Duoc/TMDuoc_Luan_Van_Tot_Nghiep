import http from '@/configs/axios.config';

export type DecisionTreeType = {
  file: File;
  type: string;
  conti_attribute: any[] | string;
};

export const DECISION_TREE_PREDICTION = async (data: DecisionTreeType) => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('type', data.type);
  formData.append('conti_attribute', data.conti_attribute.toString());
  return http.post('/decision-tree-c45', formData);
};
