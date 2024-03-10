import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomeButton = () => {
  return (
    <Link to='/' className='w-full capitalize py-2 flex items-center '>
      <ChevronLeft className='w-6 h-6' />
      <span className='font-medium'>Back To Home</span>
    </Link>
  );
};

export default HomeButton;
