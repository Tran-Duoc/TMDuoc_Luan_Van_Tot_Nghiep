import axios from 'axios';

interface IStudent {
  student_code: string;
  email: string;
  password: string;
}

export const register = async (data: IStudent) => {
  const studentData: IStudent = {
    student_code: data.student_code,
    email: data.email,
    password: data.password,
  };
  return axios.post(
    'http://localhost:8080/api/v1/student/register-student',
    studentData
  );
};

export const login = async (data: Omit<IStudent, 'email'>) => {
  const loginStudentData: Omit<IStudent, 'email'> = {
    student_code: data.student_code,
    password: data.password,
  };
  return axios.post(
    'http://localhost:8080/api/v1/student/login-student',
    loginStudentData
  );
};
