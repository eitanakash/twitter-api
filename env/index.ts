import * as  dotenv from 'dotenv';
import * as  fs from 'fs';
import { Logger, ShutdownSignal } from '@nestjs/common';

if (fs.existsSync('.env')) {

  Logger.warn('Using .env file to supply config environment variables');
  dotenv.config({
    path: '.env',
  });
} else {
  Logger.warn('Using .env.example file to supply config environment variables');
  dotenv.config({
    path: '.env.example',
  });
}

const env: any = process.env;

const safeEnvHandler = {
  get: (obj, prop) => {
    if (prop in obj) {
      return obj[prop];
    } else {
      Logger.error(`Property ${prop} was required but not defined. Check your .env file`);
      return ``;
    }
  },
};
const envProxy = new Proxy(env, safeEnvHandler);

const getAppShutdownSignals = (): ShutdownSignal[] => {
  try {
    const appSignals: string[] = envProxy.APP_SHUTDOWN_SIGNALS ? JSON.parse(envProxy.APP_SHUTDOWN_SIGNALS) : [ShutdownSignal.SIGINT];

    for (const signal of appSignals) {
      if (!Object.keys(ShutdownSignal).includes(signal)) {
        throw new Error(`${signal} is not supported`);
      }
    }

    return appSignals as ShutdownSignal[];
  } catch (ex) {
    Logger.error(`Invalid Application Shutdown Signal`, ex.stack, 'Env');
    throw ex;
  }
};

export { envProxy as env, getAppShutdownSignals };
