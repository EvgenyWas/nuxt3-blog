import { z } from 'zod';

import { AUTH_PROVIDERS, MAX_USER_SOCIALS, MIN_USER_NAME_LENGTH } from '~/configs/properties';
import { base64Validator, emailValidator, phoneValidator, urlValidator } from '~/utils/validators';

export const userIdentitySchema = z
  .object({
    id: z.string(),
    provider: z.nativeEnum(AUTH_PROVIDERS),
  })
  .required()
  .strict();

export const userProfileSchema = z
  .object({
    id: z.string().or(z.null()),
    name: z.string().min(MIN_USER_NAME_LENGTH),
    email: emailValidator,
    avatar: z.string().refine((value) => !base64Validator.safeParse(value).success),
    description: z.string().optional(),
    address: z.string().optional(),
    phone: phoneValidator.optional(),
    socials: z.array(urlValidator.or(z.literal(''))).max(MAX_USER_SOCIALS),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .required()
  .strict({ message: 'Unknown keys are presented in the payload' });
