'use client';

import React from 'react';

interface TableDataProps {
  data: Object[];
  setArrValue?: React.Dispatch<React.SetStateAction<[]>> | any;
}

const TableData = ({ data, setArrValue }: TableDataProps) => {
  const handleOnSelectValueChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: any
  ) => {
    console.log(`at ${index} change the value of ${e.target.value}`);
  };

  return (
    <table className='border-collapse border border-black w-full'>
      <thead>
        <tr>
          {data &&
            data.length > 0 &&
            Object.keys(data[0]).map((key, index) => {
              let conditionDefaultSelectValue;

              if (index < data.length - 1) {
                conditionDefaultSelectValue = !isNaN(
                  Number(Object.values(data[1])[index])
                )
                  ? false
                  : true;
              }

              return (
                <th
                  key={index}
                  className='bg-gray-200 border border-black px-4 py-2'
                >
                  {index === Object.keys(data[0]).length - 1 ? (
                    <span>{key}</span>
                  ) : (
                    <div className='flex justify-between items-center'>
                      <span>{key}</span>
                      <select
                        className='px-2 py-1'
                        onChange={(e) => handleOnSelectValueChange(e, index)}
                      >
                        <option
                          selected={conditionDefaultSelectValue}
                          value='continuous'
                          className='capitalize'
                        >
                          Liên tục
                        </option>
                        <option
                          selected={conditionDefaultSelectValue}
                          value='discrete'
                          className='capitalize'
                        >
                          Rời rạc
                        </option>
                      </select>
                    </div>
                  )}
                </th>
              );
            })}
        </tr>
      </thead>
      <tbody>
        {data &&
          data.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, index) => (
                <td key={index} className='border border-black px-4 py-2'>
                  {value}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default TableData;
