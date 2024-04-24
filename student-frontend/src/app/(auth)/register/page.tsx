'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { registerFormType, registerFromSchema } from '@/types/register.type';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';

import Link from 'next/link';
import { register } from '@/apis/auth';
import { useRouter } from 'next/navigation';
const RegisterPage = () => {
  const router = useRouter();
  const form = useForm<registerFormType>({
    resolver: zodResolver(registerFromSchema),
    defaultValues: {
      student_code: '',
      password: '',
      email: '',
      confirmPassword: '',
    },
  });

  React.useEffect(() => {
    const firstError = (
      Object.keys(form.formState.errors) as Array<
        keyof typeof form.formState.errors
      >
    ).reduce<keyof typeof form.formState.errors | null>((field, a) => {
      const fieldKey = field as keyof typeof form.formState.errors;
      return !!form.formState.errors[fieldKey] ? fieldKey : a;
    }, null);

    if (firstError) {
      form.setFocus(firstError as any);
    }
  }, [form]);

  const onSubmit = async (data: registerFormType) => {
    const newData = {
      email: data.email,
      password: data.password,
      student_code: data.student_code,
    };
    await register(newData)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          router.push('/login');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='h-screen flex items-center justify-center'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='max-w-[500px] w-full p-4 mx-2 md:mx-0 border shadow rounded-md flex flex-col gap-y-2'
        >
          <h2 className='text-2xl font-semibold capitalize  text-blue-500'>
            Register Student Form
          </h2>
          <p className='font-bold'>
            Have an account?
            <Link
              className=' text-sm text-blue-500 font-normal hover:underline'
              href='login'
            >
              {' '}
              Log in now
            </Link>
          </p>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='email address!' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='student_code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student Code</FormLabel>
                <FormControl>
                  <Input placeholder='student code!' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex gap-x-2'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder='password!' {...field} type='password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='confirm password!'
                      {...field}
                      type='password'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button>Register</Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterPage;
