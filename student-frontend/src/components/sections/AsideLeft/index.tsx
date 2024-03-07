'use client';

import { NAV_ITEMS } from '@/constants';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const AsideLeft = () => {
  const pathname = usePathname();
  return (
    <div className='fixed top-14 w-56 left-0 bottom-0 border-r-2'>
      <div className='flex flex-col py-2'>
        {NAV_ITEMS.map((item, index) => {
          return (
            <Link
              href={item.path}
              key={index}
              className={cn(
                'flex items-center py-3 px-4 space-x-2 justify-start ',
                {
                  'bg-blue-500 text-white': pathname === item.path,
                  'hover:bg-slate-200 duration-200': pathname !== item.path,
                }
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AsideLeft;
