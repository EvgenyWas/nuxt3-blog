import { Schema, model } from 'mongoose';
import { AUTH_PROVIDERS, MAX_USER_SOCIALS, MIN_USER_NAME_LENGTH } from '~/configs/properties';
import { emailValidator, passwordValidator, base64Validator } from '~/utils/validators';

const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: MIN_USER_NAME_LENGTH,
    },
    email: {
      type: String,
      required: true,
      immutable: true,
      validate: {
        validator: (value: string) => emailValidator.safeParse(value).success,
      },
    },
    password: {
      type: String,
      validate: {
        validator: (value: string) => passwordValidator.safeParse(value).success,
      },
    },
    avatar: {
      type: String,
      validate: {
        validator: (value?: string) => !base64Validator.safeParse(value).success,
        message: 'Avatar in base64 format is forbidden.',
      },
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
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
    },
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
