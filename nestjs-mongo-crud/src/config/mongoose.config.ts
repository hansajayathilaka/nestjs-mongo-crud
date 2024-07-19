import { registerAs } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export default registerAs(
  'mongooseConfig',
  () =>
    ({
      uri: `${process.env.MONGODB_URI}`,
    }) as MongooseModuleFactoryOptions,
);
