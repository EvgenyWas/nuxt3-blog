import { Schema, model } from 'mongoose';
import { AUTH_PROVIDERS, MIN_USER_NAME_LENGTH } from '~/configs/properties';
import { emailValidator, passwordValidator } from '~/utils/validators';

const schema = new Schema({
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
      validator: (value: string) => !value.startsWith('data:'),
      message: 'Avatar in base64 format is forbidden.',
    },
  },
  auth_provider: {
    type: String,
    enum: Object.values(AUTH_PROVIDERS),
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

schema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Profile = model('user_profile', schema);

export default Profile;
