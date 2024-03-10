import React from 'react';

import {
  FileItem,
  FileUploadProcessBar,
  UploadFile,
} from '@/components/common';
import ClassDetailLayout from '@/layouts/ClassDetailLayout';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

const ClassDetail = () => {
  const [files, setFiles] = React.useState<File[] | null>(null);
  const param = useParams();
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <ClassDetailLayout>
      <FileUploadProcessBar files={files} setFiles={setFiles} />
      {files && files.length > 0 && (
        <div>
          <Button disabled={false}>
            {loading && <Loader className='w-4 h-4 mr-2 animate-spin' />}
            Upload
          </Button>
        </div>
      )}
      <div className='grid grid-cols-6 gap-4 mt-4 px-2'>
        <FileItem />
        <UploadFile setFiles={setFiles} />
      </div>
    </ClassDetailLayout>
  );
};

export default ClassDetail;
