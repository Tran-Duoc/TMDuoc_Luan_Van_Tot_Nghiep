'use client';

import {
  KNN_PREDICTION,
  KNN_PREDICTION_CONTINUES,
  KnnPredictionType,
} from '@/apis/knn-prediction';
import { SelectDistance, TableData } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { parseCSV } from '@/lib/utils';
import { FileArchiveIcon } from 'lucide-react';
import { LoaderIcon } from 'lucide-react';
import { toast } from 'sonner';

import React from 'react';
const checkTypeInArray = (arr: any[]) => {
  const arrValue: number[] = [];
  arr.map((item, index) => {
    console.log(!isNaN(Number(item)));
    const conditionPushed = !isNaN(Number(item));
    if (conditionPushed) {
      arrValue.push(index);
    }
  });
  return arrValue;
};

const KNearestNearest = () => {
  const [fileData, setFileData] = React.useState<File | null>(null);
  const [csvData, setCsvData] = React.useState<Object[] | null>([]);
  const [arrValue, setArrValue] = React.useState<any[]>([]);
  const [kNearest, setKNearest] = React.useState<number>(0);
  const [loading, setIsLoading] = React.useState<boolean>(false);
  const [mostKNearestNeighbors, setMostKNearestNeighbors] = React.useState<[]>(
    []
  );
  const [isContinuous, setISContinuous] = React.useState<boolean>(false);
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [selectValue, setSelectValue] = React.useState<string | null>(null);

  const handleOnFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileData(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        const text = reader.result as string;
        const firstData = text.split('\n');
        const convertData = firstData[1].split(',');
        const typeOfValue = checkTypeInArray(
          convertData.splice(0, convertData.length - 1)
        );

        setArrValue(typeOfValue);
        if (typeOfValue.length > 0) {
          setISContinuous(true);
        }
        const parseCSVData = parseCSV(text);
        setCsvData(parseCSVData);
      }
    };
    reader.readAsText(file);
  };

  const handleOnKNearestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const k_nearest = Number(e.target.value);
    if (k_nearest % 2 === 0 || k_nearest < 1) {
      toast.warning('The nearest distance invalid', {
        description:
          'The nearest distance must be greater than 0 and odd numbers ',
      });
    }

    setKNearest(k_nearest);
  };

  const handlePredict = async () => {
    setIsLoading(true);
    const dataDiscrete: Omit<KnnPredictionType, 'distance_calculation'> = {
      file: fileData as File,
      k_nearest: kNearest,
    };

    if (arrValue.length === 0) {
      await KNN_PREDICTION(dataDiscrete)
        .then((response) => {
          console.log(response.data);
          if (response.data) {
            setIsFetching(true);
            const distance = Object.values(response.data.data);
            console.log(distance);
            const mostKNearestNeighbors = response.data.merged_results;

            const newCSVData = csvData?.map((item, index) => ({
              ...item,
              distance: distance[index],
            }));
            setCsvData(newCSVData as Object[]);
            setMostKNearestNeighbors(mostKNearestNeighbors);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (arrValue.length === 4 && selectValue) {
      const dataContiguous: KnnPredictionType = {
        file: fileData as File,
        k_nearest: kNearest,
        distance_calculation: selectValue,
      };
      console.log('fetching value continues', selectValue, kNearest);
      await KNN_PREDICTION_CONTINUES(dataContiguous)
        .then((response) => {
          console.log(response.data);
          if (response.data) {
            setIsFetching(true);
            const distance = Object.values(response.data.data);
            console.log(distance);
            const mostKNearestNeighbors = response.data.merged_results;

            const newCSVData = csvData?.map((item, index) => ({
              ...item,
              distance: distance[index],
            }));
            setCsvData(newCSVData as Object[]);
            setMostKNearestNeighbors(mostKNearestNeighbors);
            console.log(response);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      toast('Invalid Fetching Request');
      setIsLoading(false);
      return;
    }
  };

  return (
    <div className='flex flex-col '>
      <h2 className='text-xl font-bold text-blue-500'>KNN Prediction</h2>
      <div className='p-4 bg-yellow-400/40 text-yellow-700 rounded-2xl'>
        <span className='text-xl font-semibold'>Note</span>
        <p>1. The label must be end of column csv file</p>
        <p>2. The values prediction must be end of rows</p>
        <p>3. Please reading documentation for more details.</p>
      </div>

      <div>
        <Label
          className='text-white px-2 py-2 rounded-xl'
          form='upload-file-csv'
        >
          <div className='flex items-center space-x-2 bg-blue-500 p-2 rounded-xl '>
            <FileArchiveIcon className='w-6 h-6' />
            <span>
              {fileData
                ? fileData.name + '  (' + fileData.size + ' bytes)'
                : 'Choose a file'}
            </span>
            <Input
              type='file'
              className='hidden'
              id='Label'
              accept='.csv'
              onChange={handleOnFileChange}
            />
          </div>
        </Label>
      </div>

      <div className='w-full'>
        {csvData && <TableData data={csvData} setArrValue={setArrValue} />}
      </div>

      <div>
        <Label>K Nearest</Label>
        <p className='text-red-500'>
          (K greater 1 and odd number (3, 5, 7,...))
        </p>
        <Input
          type='number'
          placeholder='Enter K Nearest!!!!!'
          min={0}
          max={100}
          defaultValue={kNearest}
          onChange={handleOnKNearestChange}
        />
      </div>
      <div className='mt-2'>
        {isContinuous && <SelectDistance setSelect={setSelectValue} />}
      </div>
      <div className='pt-2 w-full'>
        {fileData && kNearest > 0 && (
          <Button disabled={loading} onClick={handlePredict}>
            {loading && <LoaderIcon className='mr-2 h-4 w-4 animate-spin' />}
            Send
          </Button>
        )}
      </div>
      <div>
        {mostKNearestNeighbors && isFetching && (
          <table className='bg-header border-collapse border mt-2'>
            <thead>
              <tr className='bg-slate-300'>
                <th className='border border-gray-400 px-4 py-2 '>Distance</th>
                <th className='border border-gray-400 px-4 py-2'>Label</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(mostKNearestNeighbors).map((key, index) => (
                <tr key={index}>
                  <td className='border border-gray-400 px-4 py-2'>
                    {mostKNearestNeighbors[key].distance}
                  </td>
                  <td className='border border-gray-400 px-4 py-2'>
                    {mostKNearestNeighbors[key].label}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default KNearestNearest;
