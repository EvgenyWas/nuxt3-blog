import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';
import { merge, omit } from 'lodash-es';

interface DefaultOptions {
  access: SignOptions;
  refresh: SignOptions;
}

type Option = Pick<SignOptions, 'expiresIn' | 'subject'>;

interface Options {
  access: Option;
  refresh: Option;
}

interface JWTPair {
  accessToken: string;
  expiresIn: SignOptions['expiresIn'];
  refreshToken: string;
  refreshExpiresIn: SignOptions['expiresIn'];
}

const defaulSignOptions: SignOptions = {
  algorithm: 'HS256',
  subject: 'user',
  audience: 'audience',
  issuer: 'n3b-jwt-generator',
};

const defaultOptions: DefaultOptions = {
  access: {
    ...defaulSignOptions,
    expiresIn: '5m',
  },
  refresh: {
    ...defaulSignOptions,
    expiresIn: '1d',
  },
};

export default class JWTGenerator {
  private accessSecret: string;
  private refreshSecret: string;
  private options: DefaultOptions;

  constructor(accessSecret?: string, refreshSecret?: string, options = {} as Options) {
    this.accessSecret = accessSecret ?? 'accessSecret';
    this.refreshSecret = refreshSecret ?? 'refreshSecret';
    this.options = merge({}, defaultOptions, options);
  }

  sign<T extends JwtPayload>(payload: T, audience?: SignOptions['audience']): JWTPair {
    const accessToken = jwt.sign(payload, this.accessSecret, {
      ...this.options.access,
      audience: audience ?? this.options.access.audience,
    });
    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      ...this.options.refresh,
      audience: audience ?? this.options.refresh.audience,
    });

    return {
      accessToken,
      expiresIn: this.options.access.expiresIn,
      refreshToken,
      refreshExpiresIn: this.options.refresh.expiresIn,
    };
  }

  refresh(token: string, audience = this.options.refresh.audience): JWTPair {
    const payload = jwt.verify(token, this.refreshSecret, { audience, issuer: this.options.access.issuer });
    if (typeof payload === 'string') {
      throw new TypeError('Invalid token payload');
    }

    const preparedPayload = omit(payload, ['iat', 'exp', 'nbf', 'jti']);
    const accessToken = jwt.sign(preparedPayload, this.accessSecret);
    const refreshToken = jwt.sign(payload, this.refreshSecret);

    return {
      accessToken,
      expiresIn: this.options.access.expiresIn,
      refreshToken,
      refreshExpiresIn: this.options.refresh.expiresIn,
    };
  }

  verifyAccessToken<T extends JwtPayload>(token: string, audience = this.options.access.audience): T {
    return jwt.verify(token, this.accessSecret, { audience, issuer: this.options.access.issuer }) as T;
  }
}
