'use client';

import { formatDate } from '@/lib/utils';
import { Book, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const ExerciseDeTail = () => {
  const router = useRouter();

  const handleMovePageToPrev = () => {
    router.back();
  };

  return (
    <div className='w-full'>
      <div className='w-full h-14  bg-blue-500 text-white flex items-center px-4'>
        <ChevronLeft className='w-8 h-8' onClick={handleMovePageToPrev} />
      </div>
      <div className='max-w-4xl w-full mx-auto mt-2 flex flex-col gap-y-2'>
        <div className='flex w-full items-center justify-start gap-x-2 pb-5 px-2 border-b-2 border-blue-500'>
          <Book className='w-8 h-8 rounded-full text-white bg-blue-500 p-2' />
          <div className='flex flex-col'>
            <p className='text-sm font-semibold'>Name exercise</p>
            <span className='text-xs font-light'>{formatDate('')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDeTail;
