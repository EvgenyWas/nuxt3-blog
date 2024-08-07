import { appendResponseHeader, H3Event } from 'h3';
import { ZodError } from 'zod';

export async function fetchWithCookie<T>(event: H3Event | undefined, ...args: Parameters<typeof $fetch>): Promise<T> {
  if (event) {
    const res = await $fetch.raw(...args);
    const cookies = (res.headers.get('set-cookie') ?? '').split(',');
    cookies.forEach((cookie) => {
      appendResponseHeader(event, 'set-cookie', cookie);
    });

    return res._data;
  } else {
    return await $fetch<T>(...args);
  }
}

export function isZodError(value: unknown): value is ZodError {
  return value instanceof ZodError;
}
