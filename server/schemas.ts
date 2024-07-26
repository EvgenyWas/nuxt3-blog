import { z } from 'zod';

import { AUTH_PROVIDERS, MAX_USER_SOCIALS, MIN_USER_NAME_LENGTH } from '~/configs/properties';
import { base64Validator, phoneValidator, urlValidator } from '~/utils/validators';

export const userIdentitySchema = z
  .object({
    id: z.string(),
    provider: z.nativeEnum(AUTH_PROVIDERS),
  })
  .required()
  .strict();

export const userUpdateProfileSchema = z
  .object({
    name: z.string().min(MIN_USER_NAME_LENGTH),
    avatar: z.string().refine((value) => !base64Validator.safeParse(value).success),
    description: z.string(),
    address: z.string(),
    phone: phoneValidator.or(z.literal('')),
    socials: z.array(urlValidator.or(z.literal(''))).max(MAX_USER_SOCIALS),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .required()
  .strict({ message: 'Unknown keys are presented in the payload' });
