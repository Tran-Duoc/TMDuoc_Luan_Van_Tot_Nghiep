import React from 'react';

import { ClassDetailLink } from '@/components/sections';
import { MainLayout } from '@/layouts';
import { getAllClass } from '@/apis/class.api';
import { IClass } from '@/interfaces/class.interface';
import { LoadingFillPage } from '@/components/common';

export const slugParam = (param: string) => {
  return param.split(' ').join('-').toLocaleLowerCase();
};

const MainPage = () => {
  const [classes, setClasses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    getAllClass()
      .then((res) => {
        if (res.status === 200) {
          setClasses(res.data.classes);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <MainLayout>
      {loading ? (
        <LoadingFillPage />
      ) : (
        <div className='grid grid-cols-4 gap-4'>
          {classes.map((className: IClass) => {
            return (
              <ClassDetailLink
                key={className._id}
                path={`/class-detail/${className._id}?q=${slugParam(
                  className.class_name
                )}`}
                className={className.class_name}
              />
            );
          })}
        </div>
      )}
      {/* <div className='grid grid-cols-4 gap-x-3 p-4'></div> */}
    </MainLayout>
  );
};

export default MainPage;
