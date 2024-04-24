import ClassDetailLayout from '@/layouts/ClassDetailLayout';

import ExerciseItem from './_components/ExerciseItem';
import TitleBar from './_components/TitleBar';
import ExerciseCreateButton from './_components/ExerciseCreateButton ';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import { Params, useParams, useSearchParams } from 'react-router-dom';
import { getExerciseByClassId } from '@/apis/exercise.api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';

type Exercise = {
  title: string;
  class_id: string;
  createdAt: string;
};

const parseParam = (param: string) => {
  const word = param.split('-').join(' ');
  const words = word.split(' ');

  // Capitalize the first letter of each word
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  // Join the words back into a single string
  return words.join(' ');
};
const ClassDetail = () => {
  const [exercises, setExercises] = React.useState([]);

  const param: Params<string> = useParams();
  console.log(param);

  const [searchParams] = useSearchParams();

  console.log(Object.fromEntries([...searchParams]));

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
              <TitleBar
                title={parseParam(Object.fromEntries([...searchParams])['q'])}
              />
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
          <TabsContent value='people'>
            <Button className='capitalize'>
              <Label htmlFor='label-invite_student'>Invite Student</Label>
              <Input
                type='file'
                //For Excel Files 2007+ (.xlsx)
                accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                className='hidden'
                name='label-invite_student'
                id='label-invite_student'
              />
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </ClassDetailLayout>
  );
};

export default ClassDetail;
