import { z } from 'zod';

import { AUTH_PROVIDERS } from '~/configs/properties';

export const userIdentitySchema = z
  .object({
    id: z.string(),
    provider: z.nativeEnum(AUTH_PROVIDERS),
  })
  .required()
  .strict();
