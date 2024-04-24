'use client';

import React from 'react';
import BounceLoader from 'react-spinners/BounceLoader';

const RootLoading = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
      <BounceLoader className='w-32h h-32 ' color='#36c4d7' />
    </div>
  );
};

export default RootLoading;
