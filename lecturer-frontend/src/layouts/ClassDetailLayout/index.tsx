import HomeButton from '@/components/common/HomeButton';
import { Header } from '@/components/sections';

interface ClassDetailLayoutProps {
  children: React.ReactNode;
}

const ClassDetailLayout = ({ children }: ClassDetailLayoutProps) => {
  return (
    <div>
      <Header />
      <div className='p-2 flex flex-col'>
        <HomeButton />
        <div className='flex flex-col gap-y-2'>{children} </div>
      </div>
    </div>
  );
};

export default ClassDetailLayout;
