import { ExerciseDetailLayout } from '@/layouts';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Book } from 'lucide-react';
import React from 'react';

import { toast } from 'sonner';
import { getExercise } from '@/apis/exercise.api';
import { formatDate } from '../../lib/utils';

const ExerciseDetailPage = () => {
  const param = useParams();
  const [exercises, setExercises] = React.useState({
    class_id: ' ',
    description: '',
    files: [],
    message: '',
    success: true,
    title: '',
    _id: '',
    createdAt: '',
  });
  React.useEffect(() => {
    getExercise(param)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setExercises(response.data);
        }
      })
      .catch((error) => {
        toast(error.message);
      });
  }, [param]);

  const createMarkup = (htmlString: string) => {
    return { __html: htmlString };
  };

  const navigate = useNavigate();
  return (
    <ExerciseDetailLayout>
      <Breadcrumb className='h-14 border-b-2 flex items-center px-10 text-2xl font-semibold capitalize breadscrumb'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/' className=''>
              Home page
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem
            className=' hover:underline '
            onClick={() => navigate(-1)}
          >
            <BreadcrumbPage>{exercises.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='mt-5 max-w-4xl w-full flex flex-col mx-auto'>
        <div className='flex gap-5 items-center border-b pb-4 border-blue-500'>
          <div className='p-2 rounded-full bg-blue-500 text-white'>
            <Book className='w-5 h-5' />
          </div>
          <div className='flex flex-col gap-y-1'>
            <span className='text-2xl font-medium  text-blue-500'>
              {exercises.title}
            </span>
            <div className='font-normal text-sm'>
              {formatDate(exercises.createdAt)}
            </div>
          </div>
        </div>
        <div
          dangerouslySetInnerHTML={createMarkup(exercises.description)}
          className='mt-2 p-4 rounded hover:bg-slate-100 '
        />
        <div className='mt-5 pt-5 pb-6 grid grid-cols-3 border-t gap-x-2'>
          {exercises.files.map((file, index) => {
            return (
              <div className='w-full p-2 border-2 rounded-md h-24 hover:bg-slate-100'>
                <Link
                  to={`http://localhost:8080/${file}`}
                  key={index}
                  className='hover:text-blue-500 line-clamp-1 hover:underline'
                  title={file}
                >
                  {file}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </ExerciseDetailLayout>
  );
};

export default ExerciseDetailPage;
