import { type UploadApiErrorResponse } from 'cloudinary';
import { H3Event } from 'h3';
import { has } from 'lodash-es';
import { MongooseError } from 'mongoose';

import { COOKIE_NAMES } from '~/configs/properties';

export function cleanAuth(event: H3Event): void {
  setResponseHeader(event, 'Authorization', '');
  deleteCookie(event, COOKIE_NAMES.refreshToken);
  deleteCookie(event, COOKIE_NAMES.userIdentity);
}

export function isMongooseError(value: unknown): value is MongooseError {
  return value instanceof MongooseError;
}

export function isCloudinarUploadApiError(value: unknown): value is UploadApiErrorResponse {
  return has(value, 'message') && has(value, 'http_code') && has(value, 'name');
}
