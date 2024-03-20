import { formatDate } from '@/lib/utils';
import { Album } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExerciseItemProps {
  title: string;
  createdAt: string;
  class_id: string;
}

const ExerciseItem = ({ title, createdAt, class_id }: ExerciseItemProps) => {
  const formattedDate = formatDate(createdAt);
  return (
    <Link
      to={`exercise-detail/${class_id}`}
      className='w-full rounded-xl  px-4 py-3 border-2 hover:bg-[#e8f0fe]'
    >
      <div className='flex gap-x-4 items-center'>
        <div className='p-3 rounded-full text-white bg-blue-500'>
          <Album className='w-5 h-5' />
        </div>
        <div className='flex flex-col gap-y-1'>
          <h2
            className='text-base font-medium leading-5'
            title='this is title '
          >
            {title}
          </h2>
          <span className='text-xs'>{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
};

export default ExerciseItem;
