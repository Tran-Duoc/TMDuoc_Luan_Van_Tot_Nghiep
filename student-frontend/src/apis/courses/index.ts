import axios from 'axios';

export const getCourseOfStudent = async (student_id: string) => {
  return await axios.get('http://localhost:8080/api/v1/courses', {
    params: {
      student_id: student_id,
    },
  });
};

export const getCourseOfStudentWithClassId = async (class_id: string) => {
  return await axios.get(`http://localhost:8080/api/v1/file/${class_id}`);
};
