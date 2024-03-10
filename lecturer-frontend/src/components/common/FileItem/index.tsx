import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MoreVertical } from 'lucide-react';

const FileItem = () => {
  return (
    <div className='w-full h-56 hover:bg-slate-200 bg-slate-200/50 rounded-md flex flex-col p-2 gap-y-2 '>
      <div className='flex item-center justify-between px-2 gap-6'>
        <p className='text-center line-clamp-1'>file name</p>
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
    </div>
  );
};

export default FileItem;
