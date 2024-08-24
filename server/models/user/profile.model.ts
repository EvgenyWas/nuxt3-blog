import { Schema, model } from 'mongoose';

import {
  AUTH_PROVIDERS,
  MAX_USER_ADDRESS_LENGTH,
  MAX_USER_DESCRIPTION_LENGTH,
  MAX_USER_EMAIL_LENGTH,
  MAX_USER_NAME_LENGTH,
  MAX_USER_PASSWORD_LENGTH,
  MAX_USER_SOCIALS,
  MIN_USER_NAME_LENGTH,
} from '~/configs/properties';
import { emailValidator, passwordValidator, dataURIValidator, phoneValidator } from '~/utils/validators';

const favouritesSubschema = new Schema(
  {
    path: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      default: '',
    },
  },
  { _id: false },
);

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: MIN_USER_NAME_LENGTH,
      maxLength: MAX_USER_NAME_LENGTH,
    },
    email: {
      type: String,
      required: true,
      immutable: true,
      maxLength: MAX_USER_EMAIL_LENGTH,
      validate: {
        validator: (value: string) => emailValidator.safeParse(value).success,
      },
    },
    password: {
      type: String,
      maxLength: MAX_USER_PASSWORD_LENGTH,
      validate: {
        validator: (value: string) => passwordValidator.safeParse(value).success,
      },
    },
    avatar: {
      type: String,
      default: '',
      validate: {
        validator: (value?: string) => !dataURIValidator.safeParse(value).success,
        message: 'Avatar in base64 format is forbidden.',
      },
    },
    description: {
      type: String,
      default: '',
      maxLength: MAX_USER_DESCRIPTION_LENGTH,
    },
    address: {
      type: String,
      default: '',
      maxLength: MAX_USER_ADDRESS_LENGTH,
    },
    phone: {
      type: String,
      default: '',
      validate: {
        validator: (value: string) => !value || phoneValidator.safeParse(value).success,
        message: 'Phone value is incorrect',
      },
    },
    socials: {
      type: Array,
      validate: {
        validator: (value: Array<string>) => value.length <= MAX_USER_SOCIALS,
        message: `The maximum number of socials is ${MAX_USER_SOCIALS}`,
      },
      default: () => Array(MAX_USER_SOCIALS).fill(''),
    },
    auth_provider: {
      type: String,
      enum: Object.values(AUTH_PROVIDERS),
      immutable: true,
      required: true,
    },
    favourites: [favouritesSubschema],
  },
  { timestamps: true },
);

schema.set('toObject', {
  transform: function (_, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    delete ret.auth_provider;
    delete ret.password;

    return ret;
  },
});

const Profile = model('user_profile', schema);

export default Profile;
