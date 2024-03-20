import { cn } from '@/lib/utils';
import { Trash } from 'lucide-react';

interface FileUploadProps {
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
}

const FileUploadProcessBar = ({ files, setFiles }: FileUploadProps) => {
  const handleRemoveFilesChange = (id: number) => {
    console.log(id);
    if (files) {
      const newFiles = [...files];
      const fileFilter = newFiles.filter((file) => file.lastModified !== id);
      console.log(fileFilter);
      setFiles(fileFilter);
    }
  };

  return (
    <div
      className={cn('my-2 flex flex-col gap-y-3 px-2 ', {
        hidden: !files,
        block: files,
      })}
    >
      <span className='font-bold capitalize underline'>Files</span>
      <div className='grid gap-x-2 w-full  grid-cols-6 mt-2'>
        {files &&
          files.map((file) => {
            return (
              <div
                className='border-2 w-full p-2 flex items-center justify-between gap-14 rounded-md hover:bg-slate-200'
                key={file.lastModified}
              >
                <span className='line-clamp-1'>{file.name}</span>
                <Trash
                  className='w-5 h-5 hover:text-red-400'
                  onClick={() => handleRemoveFilesChange(file.lastModified)}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default FileUploadProcessBar;
