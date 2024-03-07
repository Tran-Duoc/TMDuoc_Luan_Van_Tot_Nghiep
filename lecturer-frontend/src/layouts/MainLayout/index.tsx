import React from 'react';
import { Aside, Header } from '../../components/sections';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className='flex flex-col'>
      <Header />
      <Aside />
      <div className='ml-[210px] p-2'>{children}</div>
    </div>
  );
};

export default MainLayout;
