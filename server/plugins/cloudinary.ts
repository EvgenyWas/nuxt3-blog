import { v2 as cloudinary } from 'cloudinary';
import chalk from 'chalk';

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig();
  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
    secure: true,
  });
  console.log(chalk.green('✔'), 'Cloudinary is connected successfully.');
});
