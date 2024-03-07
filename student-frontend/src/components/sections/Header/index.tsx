import Image from 'next/image';
import React from 'react';

const Header = () => {
  return (
    <div className='flex items-center h-14 border-b px-4 bg-slate-100 fixed left-0 right-0 top-0 z-10'>
      <Image
        src='/images/cit.png'
        alt='this is a logo'
        width={50}
        height={50}
      />
    </div>
  );
};

export default Header;
