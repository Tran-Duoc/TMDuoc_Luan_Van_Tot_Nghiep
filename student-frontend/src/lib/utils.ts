import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
