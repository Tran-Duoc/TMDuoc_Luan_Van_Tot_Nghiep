'use client';
import { TableData } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';
import { checkTypeInArray } from '../k-nearest-neighbor/page';
import { parseCSV } from '@/lib/utils';
import { LoaderIcon } from 'lucide-react';
import { CalculatorProbability } from '@/apis/naive-bayes';
import { useToast } from '@/components/ui/use-toast';

const NaiveBayesPage = () => {
  const { toast } = useToast();
  const [csvData, setCsvData] = React.useState<Object[] | null>([]);
  const [arrValue, setArrValue] = React.useState<any[]>([]);
  const [fileData, setFileData] = React.useState<File | null>(null);
  const [isContinuous, setISContinuous] = React.useState<boolean>(false);
  const [loading, setIsLoading] = React.useState<boolean>(false);
  const [labelProbability, setLabelProbability] = React.useState(null);

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

  const handleCalculatorProbability = async () => {
    console.log(isContinuous);
    if (isContinuous === true) {
      toast({
        variant: 'destructive',
        title: 'Data is a continuous value, up coming in feature ',
      });
      return;
    }

    setIsLoading(true);
    await CalculatorProbability(fileData as File)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setLabelProbability(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className='flex flex-col gap-y-2'>
      <h2 className='uppercase text-2xl text-blue-500 py-2 font-semibold'>
        NAIVE BAYES
      </h2>
      <div>
        <Button>
          <Label htmlFor='choose-csv-file'>Choose a file</Label>
          <Input
            type='file'
            id='choose-csv-file'
            name='choose-csv-file'
            className='hidden'
            accept='.csv'
            onChange={handleOnFileChange}
          />
        </Button>
      </div>
      <div>
        {csvData && <TableData data={csvData} setArrValue={setArrValue} />}
      </div>
      <div>
        {csvData && csvData?.length > 0 && (
          <Button
            className='capitalize'
            onClick={handleCalculatorProbability}
            disabled={loading}
          >
            {loading && <LoaderIcon className='mr-2 h-4 w-4 animate-spin' />}
            calculator probability
          </Button>
        )}
      </div>
      {labelProbability ? (
        <table className='border'>
          <thead className='border text-center'>
            <tr>
              {Object.keys(labelProbability).map((label) => {
                return (
                  <th key={label} className='border bg-slate-300 py-3'>
                    {label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className='text-center'>
            {Object.values(labelProbability).map((value: any) => {
              return (
                <td key={value} className='border  py-3'>
                  {String(value.toFixed(3))}
                </td>
              );
            })}
          </tbody>
        </table>
      ) : (
        ''
      )}
      {}
    </div>
  );
};

export default NaiveBayesPage;
