'use client';
import React from 'react';
import { loginFormType, loginFromSchema } from '@/types/login.type';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { login } from '@/apis/auth';
import { cn, saveIdStudentToCookie, setTokenToCookie } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

const LoginPage = () => {
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  const form = useForm<loginFormType>({
    resolver: zodResolver(loginFromSchema),
    defaultValues: {
      student_code: '',
      password: '',
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

  const onSubmit = async (data: loginFormType) => {
    setLoading(true);
    await login({
      student_code: data.student_code,
      password: data.password,
    })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          const { token, _id: student_id } = res.data.data.student;
          setTokenToCookie(token);
          saveIdStudentToCookie(student_id);
          router.push('/');
        }
      })
      .finally(() => {
        setLoading(false);
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
            Login To CIT Machine Learning Tools
          </h2>
          <p className='font-bold'>
            Haven&apos;t an account?
            <Link
              className=' text-sm text-blue-500 font-normal hover:underline'
              href='register'
            >
              {' '}
              Sign in now
            </Link>
          </p>

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

          <Button disabled={loading}>
            <Loader
              className={cn('w-5 h-5 animate-spin hidden float-end', {
                block: loading,
              })}
            />
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginPage;
