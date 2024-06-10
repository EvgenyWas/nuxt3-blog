/* eslint-disable no-control-regex */
import { z } from 'zod';

export const emailValidator = z
  .string()
  .min(1, { message: 'You must enter email.' })
  .email({ message: 'Email must be valid.' });

export const passwordValidator = z
  .string()
  .min(8, { message: 'Password must have at least 8 characters' })
  .regex(/[A-Z]/g, { message: 'Password must have at least one capital letter' })
  .regex(/[0-9]/g, { message: 'Password must have at least one number' })
  .regex(/[$&+,:;=?@#|'<>.^*()%!-]/g, { message: 'Password must have at least one special character' })
  .refine((value) => !/[^\x00-\x7F]/g.test(value), { message: 'Password must have only ASCII characters' });

export const base64Validator = z.string().base64({ message: 'The value must be a valid base64 string' });

export const phoneValidator = z
  .string()
  .regex(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, 'The value is not a valid phone number');

export const urlValidator = z.string().url({ message: 'The value must be a valid URL' });

export const fileSizeValidator = (size: number) =>
  z.custom<File>().refine((file: File) => !file || file.size <= size, {
    message: `The maximum file size is ${size / 1024 / 1024} MB`,
  });

export const fileTypeValidator = (type: string | Array<string>) => {
  const message = `The acceptable types are ${Array.isArray(type) ? type.join(', ') : type}`;

  return z
    .custom<File>()
    .refine(
      (file: File) => !file || (Array.isArray(type) ? type.includes(file.type) : new RegExp(type).test(file.type)),
      {
        message,
      },
    );
};
