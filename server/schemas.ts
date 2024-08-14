import { z } from 'zod';

import {
  AUTH_PROVIDERS,
  MAX_USER_ADDRESS_LENGTH,
  MAX_USER_DESCRIPTION_LENGTH,
  MAX_USER_NAME_LENGTH,
  MAX_USER_SOCIAL_LENGTH,
  MAX_USER_SOCIALS,
  MIN_USER_NAME_LENGTH,
} from '~/configs/properties';
import { dataURIValidator, phoneValidator, urlValidator } from '~/utils/validators';

export const userIdentitySchema = z
  .object({
    id: z.string(),
    provider: z.nativeEnum(AUTH_PROVIDERS),
  })
  .required()
  .strict();

export const userFavouriteSchema = z
  .object({
    path: z.string(),
    title: z.string(),
    topic: z.string().optional(),
  })
  .strict();

export const userUpdateProfileSchema = z
  .object({
    name: z.string().min(MIN_USER_NAME_LENGTH).max(MAX_USER_NAME_LENGTH),
    avatar: z
      .string()
      .refine((value) => !dataURIValidator.safeParse(value).success)
      .or(z.literal('')),
    description: z.string().max(MAX_USER_DESCRIPTION_LENGTH),
    address: z.string().max(MAX_USER_ADDRESS_LENGTH),
    phone: phoneValidator.or(z.literal('')),
    socials: z.array(urlValidator.max(MAX_USER_SOCIAL_LENGTH).or(z.literal(''))).max(MAX_USER_SOCIALS),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    favourites: z.array(userFavouriteSchema).optional(),
  })
  .required()
  .strict({ message: 'Unknown keys are presented in the payload' });
