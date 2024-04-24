import { setCookie, deleteCookie } from 'cookies-next';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import moment from 'moment';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseCSV = (csvText: string) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',');
  const parsedData = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');

    if (currentLine.length === headers.length) {
      const row: any = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j].trim()] = currentLine[j].trim();
      }
      parsedData.push(row);
    }
  }

  return parsedData;
};

export const setTokenToCookie = (token: string) => {
  return setCookie('access_token', token);
};

export const cleanTokenToCookie = () => {
  return deleteCookie('access_token');
};

export interface IDecodeToken extends JwtPayload {
  student_code?: string;
}

export const decodeToken = (token: string = ''): IDecodeToken => {
  return jwtDecode(token);
};

export const saveIdStudentToCookie = (student_id: string) => {
  return setCookie('student_id', student_id);
};

export const formatDate = (createdAt: string) => {
  return moment(createdAt).format('DD [thg] MM, YYYY');
};
