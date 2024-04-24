import * as z from 'zod';

export interface IRegisterStudent {
  email: string;
  student_code: string;
  password: string;
  confirmPassword: string;
}

export const registerFromSchema = z
  .object({
    email: z
      .string()
      .min(2, {
        message: 'Please enter a email address',
      })
      .email('This is not a valid email'),
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

export type registerFormType = z.infer<typeof registerFromSchema>;
