import { ClassDetailLink } from '@/components/sections';
import { MainLayout } from '@/layouts';

const MainPage = () => {
  return (
    <MainLayout>
      <div className='grid grid-cols-4 gap-4'>
        <ClassDetailLink path='/class-detail/1' className='Hoc ki 1' />
        <ClassDetailLink path='/class-detail/2' className='Hoc ki 1' />
      </div>
    </MainLayout>
  );
};

export default MainPage;
