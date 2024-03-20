import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DialogClose } from '@radix-ui/react-dialog';
import { createClass } from '@/apis/class.api';

const formSchema = z.object({
  class_name: z.string().min(1),
});
const Aside = () => {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class_name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    setLoading(true);
    await createClass(values.class_name)
      .then((res) => {
        if (res.status === 201) {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        form.setValue('class_name', '');
        setLoading(false);
      });
  };

  return (
    <div className='w-[210px] h-[calc(100vh-54px)] top-14 border-r-2 fixed p-2'>
      <Dialog>
        <DialogTrigger className='w-full'>
          <button className='w-full border-2 py-2 rounded-lg  bg-blue-500 text-white capitalize hover:bg-blue-500/80'>
            Add Class
          </button>
        </DialogTrigger>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                // eslint-disable-next-line
                name='class_name'
                render={({ field }) => (
                  <FormItem>
                    <DialogTitle className='mb-4'>Class Name</DialogTitle>
                    <FormControl>
                      <DialogHeader>
                        <Input
                          className='w-full p-2'
                          placeholder='enter your class name !'
                          {...field}
                        />
                      </DialogHeader>
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogClose className='w-full'>
                <Button className='mt-4 w-full flex items-center relative'>
                  {loading && (
                    <Loader className='w-4  h-4 animate-spin mr-10 absolute right-0' />
                  )}
                  <span>Create</span>
                </Button>
              </DialogClose>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Aside;
