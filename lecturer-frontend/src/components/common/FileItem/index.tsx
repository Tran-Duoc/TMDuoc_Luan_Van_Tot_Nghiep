import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FileItemProps {
  filename: string;
}

const FileItem = ({ filename }: FileItemProps) => {
  return (
    <Link
      className='w-full h-56 hover:bg-slate-200 bg-slate-200/50 rounded-md flex flex-col p-2 gap-y-2 '
      to={`http://localhost:8080/${filename}`}
      target='_blank'
    >
      <div className='flex item-center justify-between px-2 gap-6'>
        <p className='text-center line-clamp-1' title={filename}>
          {filename}
        </p>
        <div>
          <Popover>
            <PopoverTrigger>
              <MoreVertical className='w-5 h-5' />
            </PopoverTrigger>
            <PopoverContent className='w-40 p-1 '>
              <Button className='w-full capitalize' variant='ghost' size='sm'>
                Remove File
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className='w-full h-full bg-white'></div>
    </Link>
  );
};

export default FileItem;
