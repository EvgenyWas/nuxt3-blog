/* eslint-disable no-control-regex */
import { z } from 'zod';

export const emailValidator = z
  .string()
  .min(1, { message: 'You must enter email.' })
  .email({ message: 'E-mail must be valid.' });

export const passwordValidator = z
  .string()
  .min(8, { message: 'Password must have at least 8 characters' })
  .regex(/[A-Z]/g, { message: 'Password must have at least one capital letter' })
  .regex(/[0-9]/g, { message: 'Password must have at least one number' })
  .regex(/[$&+,:;=?@#|'<>.^*()%!-]/g, { message: 'Password must have at least one special character' })
  .refine((value) => !/[^\x00-\x7F]/g.test(value), { message: 'Password must have only ASCII characters' });
