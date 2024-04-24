'use client';

import { getCourseOfStudent } from '@/apis/courses';
import { AsideLeft } from '@/components/sections';
import { studentIdState } from '@/stores/auth';
import dynamic from 'next/dynamic';
import React from 'react';
import { useRecoilState } from 'recoil';
const Header = dynamic(() => import('@/components/sections/Header'), {
  ssr: false,
});

import BeatLoader from 'react-spinners/BeatLoader';
import ClassCard from '@/components/common/ClassCard';

interface IClassItem {
  class_id: string;
  _id: string;
  class_name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const SlugName = (name: string) => {
  return name.split(' ').join('+');
};

export default function Home() {
  const [student_id] = useRecoilState(studentIdState);
  const [loading, setLoading] = React.useState(false);

  const [courses, setCourses] = React.useState([]);
  React.useEffect(() => {
    setLoading(true);
    getCourseOfStudent(student_id)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setCourses(res.data.data.classes);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [student_id]);

  return (
    <div className='flex flex-col'>
      <Header />
      <AsideLeft />
      <div className='ml-56 p-2 mt-14 h-full grid grid-cols-5'>
        {!loading && courses.length > 0 ? (
          courses.map((course: IClassItem) => {
            console.log(course);
            return (
              <ClassCard
                key={course._id}
                name={course.class_name}
                path={`/class-item/${course._id}?course_name=${SlugName(
                  course.class_name
                )}`}
              />
            );
          })
        ) : (
          <div className='w-full '>
            <BeatLoader color='#36d7b7' />
          </div>
        )}
      </div>
    </div>
  );
}
