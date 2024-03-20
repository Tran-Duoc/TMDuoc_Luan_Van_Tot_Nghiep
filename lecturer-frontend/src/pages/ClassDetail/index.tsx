import ClassDetailLayout from '@/layouts/ClassDetailLayout';

import ExerciseItem from './_components/ExerciseItem';
import TitleBar from './_components/TitleBar';
import ExerciseCreateButton from './_components/ExerciseCreateButton ';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import { Params, useParams } from 'react-router-dom';
import { getExerciseByClassId } from '@/apis/exercise.api';
import { toast } from 'sonner';

type Exercise = {
  title: string;
  class_id: string;
  createdAt: string;
};

const ClassDetail = () => {
  const [exercises, setExercises] = React.useState([]);

  const param: Params<string> = useParams();

  React.useEffect(() => {
    getExerciseByClassId(param)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setExercises(response.data.exercises);
        }
      })
      .catch((err) => {
        toast(err.message);
      });
  }, [param]);

  return (
    <ClassDetailLayout>
      <div className='max-w-[62.5rem] w-[calc(100%-2*1.5rem)] mx-auto flex flex-col gap-y-2'>
        <Tabs defaultValue='news' className='w-full'>
          <TabsList>
            <TabsTrigger value='news'>News</TabsTrigger>
            <TabsTrigger value='people'>Peoples</TabsTrigger>
          </TabsList>
          <TabsContent value='news'>
            <div className='flex flex-col gap-y-2'>
              <TitleBar title='Thực hiện niên luận, luận văn và thực tập thực tế' />
              <ExerciseCreateButton />
              {exercises &&
                exercises.map((exercise: Exercise, index) => {
                  return (
                    <ExerciseItem
                      key={index}
                      class_id={exercise.class_id}
                      title={exercise.title}
                      createdAt={exercise.createdAt}
                    />
                  );
                })}
            </div>
          </TabsContent>
          <TabsContent value='people'>add user here</TabsContent>
        </Tabs>
      </div>
    </ClassDetailLayout>
  );
};

export default ClassDetail;
