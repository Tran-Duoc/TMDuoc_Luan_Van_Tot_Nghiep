import { FolderPlus } from 'lucide-react';

interface UploadProps {
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
}

const UploadFile = ({ setFiles }: UploadProps) => {
  const handleOnFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    else {
      const parseFilesObjToArr = [...files];
      setFiles(parseFilesObjToArr);
    }
  };

  return (
    <label
      htmlFor='upload-file'
      className='w-full p-2 border-dashed border-2 border-black flex items-center hover:bg-slate-100/80 justify-center rounded-md'
    >
      Upload file
      <FolderPlus className='w-5 h-5 ml-4' />
      <input
        type='file'
        id='upload-file'
        className='hidden'
        multiple
        onChange={(e) => handleOnFileChange(e)}
      />
    </label>
  );
};

export default UploadFile;
