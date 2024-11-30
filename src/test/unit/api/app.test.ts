import dotenv from 'dotenv';
import Fastify from 'fastify';

import { App } from '@/api/app';
import routes from '@/api/routes';
import { Logger } from '@/infra/logs/logger';

jest.mock('dotenv');
jest.mock('fastify');
jest.mock('@/api/routes', () => jest.fn().mockResolvedValue(undefined));
jest.mock('@/infra/logs/logger', () => ({
  Logger: { info: jest.fn() },
}));

describe('App', () => {
  const fastifyInstance = {
    register: jest.fn().mockResolvedValue(undefined),
    ready: jest.fn().mockResolvedValue(undefined),
    listen: jest.fn().mockResolvedValue(undefined),
  };
  (Fastify as unknown as jest.Mock).mockReturnValue(fastifyInstance);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start the application', async () => {
    await App.start();

    expect(dotenv.config).toHaveBeenCalled();
    expect(Fastify).toHaveBeenCalled();
    expect(fastifyInstance.register).toHaveBeenCalledWith(routes);
    expect(fastifyInstance.ready).toHaveBeenCalled();
    expect(fastifyInstance.listen).toHaveBeenCalledWith({
      port: 4000,
      host: '0.0.0.0',
    });
    expect(Logger.info).toHaveBeenCalledWith('API IS RUNNING');
  });

  it('should log an error if the application fails to start', async () => {
    const error = new Error('Failed to start');
    fastifyInstance.listen.mockRejectedValue(error);

    await expect(App.start()).rejects.toThrow('Failed to start');
    expect(Logger.info).not.toHaveBeenCalled();
  });
});
