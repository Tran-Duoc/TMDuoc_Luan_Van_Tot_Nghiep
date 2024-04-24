import * as z from 'zod';

export interface ILoginStudent {
  student_code: string;
  password: string;
  confirmPassword: string;
}
export const loginFromSchema = z
  .object({
    student_code: z.string().min(1, {
      message: 'Please enter a student code',
    }),
    password: z.string().min(8, {
      message:
        'Please enter a password and the password length is 8 characters',
    }),
    confirmPassword: z.string().min(8, {
      message:
        'Please enter a password and the password length is 8 characters',
    }),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type loginFormType = z.infer<typeof loginFromSchema>;
