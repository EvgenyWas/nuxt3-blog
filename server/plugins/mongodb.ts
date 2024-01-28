import mongoose from 'mongoose';
import chalk from 'chalk';

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig();
  try {
    await mongoose.connect(config.mongodbUrl);
    console.log(chalk.green('✔'), 'MongoDB is connected successfully.');
  } catch (error) {
    console.log(chalk.red('✘'), 'Failed to connect MongoDB:', error);
  }
});
