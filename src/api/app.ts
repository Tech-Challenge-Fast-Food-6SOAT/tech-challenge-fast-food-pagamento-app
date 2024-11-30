import dotenv from 'dotenv';
import Fastify from 'fastify';

import { Logger } from '../infra/logs/logger';
import routes from './routes';

export const App = {
  start: async (): Promise<void> => {
    dotenv.config();
    const app = Fastify();
    await app.register(routes);
    await app.ready();
    await app.listen({
      port: 4000,
      host: '0.0.0.0',
    });
    Logger.info('API IS RUNNING');
  },
};
