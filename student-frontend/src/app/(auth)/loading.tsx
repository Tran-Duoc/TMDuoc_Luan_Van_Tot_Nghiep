import React from 'react';
import BarLoader from 'react-spinners/BarLoader';
const LoadingAuthPage = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
      <BarLoader className='w-20 h-20' />
    </div>
  );
};

export default LoadingAuthPage;
