'use client';

import { AsideLeft, DiagramWrapper, Header } from '@/components/sections';

export default function Home() {
  return (
    <div className='flex flex-col'>
      <Header />
      <AsideLeft />
    </div>
  );
}
