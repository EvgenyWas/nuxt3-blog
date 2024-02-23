import JWTGenerator from './jwtGenerator';

const jwtGenerator = new JWTGenerator(process.env.JWT_ACCESS_SECRET, process.env.JWT_REFRESH_SECRET);

export { jwtGenerator };
