import { Label } from '@/components/ui/label';
import CreateExerciseLayout from '@/layouts/CreateExerciseLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { useDebounceValue } from 'usehooks-ts';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { formats, modules } from '@/configs/react-quill.config';
import {
  useDropzone,
  DropzoneRootProps,
  DropzoneInputProps,
} from 'react-dropzone';

import React from 'react';
import { Button } from '@/components/ui/button';
import { createExercise } from '@/apis/exercise.api';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';

const CreateExercisePage = () => {
  const [descriptionValue, setDescriptionValue] = useDebounceValue('', 400);
  const [title, setTitle] = useDebounceValue('', 200);
  const [selectedImages, setSelectedImages] = React.useState([]);
  const param = useParams();

  const navigate = useNavigate();

  const onDrop = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (acceptedFiles: File[], _rejectedFiles: File[]) => {
      acceptedFiles.forEach((file: File) => {
        setSelectedImages((prevState: File[]) => [...prevState, file]);
      });
    },
    []
  );

  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    acceptedFiles,
    getRootProps,
    getInputProps,
  }: {
    acceptedFiles: File[];
    getRootProps: (props?: DropzoneRootProps) => DropzoneRootProps;
    getInputProps: (props?: DropzoneInputProps) => DropzoneInputProps;
  } = useDropzone({
    onDrop,
  });
  const handleChangeDescriptionValue = (val: string) => {
    setDescriptionValue(val);
  };

  const handleCreateExercise = async () => {
    if (!selectedImages || !param.id || !title || !descriptionValue) {
      toast('Value cant null');
      return;
    }
    await createExercise(
      selectedImages,
      param.id as string,
      title,
      descriptionValue
    )
      .then((response) => {
        console.log(response);
        if (response.status === 201) {
          navigate(-1);
        }
      })
      .catch((err) => {
        toast(err.message);
      });
  };

  return (
    <CreateExerciseLayout>
      <div className='max-w-6xl w-full mx-auto mt-2  flex flex-col gap-y-2 px-2 lg:px-0'>
        <div className='w-full h-14 flex items-center font-bold'>
          <ChevronLeft className='w-6 h-6' />
          <span className='underline text-xl  ' onClick={() => navigate(-1)}>
            Back
          </span>
        </div>
        <div className='w-full'>
          <Button className='w-48 right-0' onClick={handleCreateExercise}>
            Create
          </Button>
        </div>
        <div className='flex flex-col  border-2 p-4  rounded-md  hover:bg-slate-100/80'>
          <Label className='text-xl font-medium'>Title</Label>
          <input
            type='text'
            placeholder='Enter name exercise!!'
            className='mt-2 border-b-2 py-2 border-black focus:border-blue-500 focus:outline-none px-2 focus:bg-blue-500/10'
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className='flex flex-col  border-2 p-4  rounded-md  hover:bg-slate-100/80 min-h-[40vh]'>
          <Label className='text-xl font-medium'>Description</Label>
          <ReactQuill
            theme='snow'
            value={descriptionValue}
            onChange={handleChangeDescriptionValue}
            className='app mt-2 rounded-md'
            formats={formats}
            modules={modules}
          />
        </div>
        <div className='p-2 rounded-md border-2 grid grid-cols-6 gap-x-2'>
          {selectedImages.map((file: File) => {
            return (
              <div className='w-full p-2  border  '>
                <p className='line-clamp-1'>{file.name}</p>
              </div>
            );
          })}
        </div>
        <div className='flex flex-col  border-2 p-4  rounded-md  hover:bg-slate-100/80 '>
          <Label className='text-xl font-medium'>Add exercise file</Label>
          <section className='mt-2'>
            <div
              {...getRootProps({ className: 'dropzone' })}
              className='w-full border-dashed border-2 flex items-center justify-center h-24 rounded-sm'
            >
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        </div>
      </div>
    </CreateExerciseLayout>
  );
};

export default CreateExercisePage;
