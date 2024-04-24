'use client';

import { getCourseOfStudentWithClassId } from '@/apis/courses';
import { formatDate } from '@/lib/utils';
import { BookAIcon, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import React from 'react';

interface ICourseOfStudent {
  class_id: string;
  createdAt: string;
  description: string;
  files: string[];
  title: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

const BackToCoursesPage = () => {
  return (
    <header className='w-full h-14 bg-blue-500 text-white flex items-center px-4'>
      <Link href={'/'}>
        <ChevronLeft className='w-8 h-8' />
      </Link>
    </header>
  );
};

const SkeletonLoading = () => {
  return (
    <div className='w-full h-[70px] rounded-md border-2 animate-pulse flex items-center px-4'>
      <div className='flex items-center justify-start gap-x-2'>
        <div className='w-8 h-8 rounded-full bg-slate-200'></div>
        <div className='flex flex-col gap-y-1'>
          <div className='w-60 h-2.5 rounded-full bg-slate-200'></div>
          <div className='w-20 h-2.5 rounded-full bg-slate-200'></div>
        </div>
      </div>
    </div>
  );
};

const ClassItemPage = () => {
  const param = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const search = searchParams.get('course_name');
  const [course, setCourse] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  console.log(pathname);

  React.useEffect(() => {
    getCourseOfStudentWithClassId(param.class_id as string)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          setCourse(res.data.exercises);
        }
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [param.class_id]);

  const handleNavigateToExercise = (href: string) => {
    router.push(`${pathname}/${href}`);
  };

  return (
    <>
      <BackToCoursesPage />
      <div className='max-w-4xl w-full mx-auto'>
        <div className='w-full h-48 bg-[url("/images/img_learnlanguage.jpg")] bg-cover rounded-md mt-4 relative'>
          <p className='text-2xl font-semibold text-white absolute leading-3 bottom-0 px-4 py-6'>
            {search}
          </p>
        </div>
        <div className='flex flex-col gap-y-2 mt-2'>
          {loading ? (
            <>
              <SkeletonLoading />
              <SkeletonLoading />
              <SkeletonLoading />
            </>
          ) : course && course.length > 0 ? (
            course.map((courseItem: ICourseOfStudent) => {
              return (
                <div
                  onClick={() => handleNavigateToExercise(courseItem._id)}
                  className='w-full h-[70px] rounded-md border-2  flex items-center px-4 hover:bg-blue-200'
                  key={courseItem._id}
                >
                  <div className='flex items-center justify-start gap-x-2'>
                    <BookAIcon className='w-10 h-10 bg-blue-500 p-2 text-white rounded-full' />
                    <div className='flex flex-col'>
                      <p className='text-sm font-medium '>{courseItem.title}</p>
                      <div className='font-light text-xs'>
                        {formatDate(courseItem.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            'Chua co bai tap nao'
          )}
        </div>
      </div>
    </>
  );
};

export default ClassItemPage;
