'use client';

import { AsideLeft, Header } from '@/components/sections';

export default function DecisionTreeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex flex-col'>
      <Header />
      <AsideLeft />
      <div className='ml-56 p-2 mt-14'>{children}</div>
    </div>
  );
}
