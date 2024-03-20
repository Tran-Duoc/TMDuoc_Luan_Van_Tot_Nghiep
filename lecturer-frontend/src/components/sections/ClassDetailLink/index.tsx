import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ClassDetailProps {
  path: string;
  className: string;
}

const ClassDetailLink = ({ path, className }: ClassDetailProps) => {
  return (
    <div className='w-full border-2 rounded-md p-2  flex items-start justify-between gap-10 h-52 relative hover:shadow-xl'>
      <div className='w-full h-20 bg-red absolute top-0 left-0 right-0 bg-[url("/images/img_learnlanguage.jpg")] object-cover bg-cover -z-10'></div>
      <div className='flex flex-col text-white w-full'>
        <div className='flex items-center gap-6 w-full relative z-100   font-semibold text-xl leading-8 justify-between '>
          <Link
            to={path}
            className='flex-1 cursor-pointer line-clamp-1 hover:underline'
            title={className}
          >
            {className}
          </Link>
          <Popover>
            <PopoverTrigger>
              <MoreVertical className='w-5 h-5' />
            </PopoverTrigger>
            <PopoverContent className='w-40 p-2 '>
              <Button className='w-full capitalize' variant='outline' size='sm'>
                Rename
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailLink;
