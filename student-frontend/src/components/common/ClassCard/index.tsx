import Link from 'next/link';
import React from 'react';

interface IClassCard {
  name: string;
  path: string;
}

const ClassCard = ({ name, path }: IClassCard) => {
  return (
    <div className='w-full h-40 border rounded-md shadow  hover:shadow-md overflow-hidden hover:border-2 '>
      <div className='w-full h-20 bg-[url("/images/img_learnlanguage.jpg")] bg-cover relative p-2 leading-2 '>
        <Link
          href={path}
          className='absolute bottom-0 text-white font-semibold text-xl line-clamp-1 hover:underline'
        >
          {name}
        </Link>
      </div>
    </div>
  );
};

export default ClassCard;
