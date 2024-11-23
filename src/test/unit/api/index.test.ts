import { App } from '@/api/app';
import { Logger } from '@/infra/logs/logger';

jest.mock('@/infra/logs/logger', () => ({
  Logger: { error: jest.fn() },
}));

jest.mock('@/api/app', () => ({
  App: {
    start: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('APP Start', () => {
  it('should start the application successfully', async () => {
    (App.start as jest.Mock).mockResolvedValue(undefined);

    await import('@/api/index');

    expect(App.start).toHaveBeenCalled();
    expect(Logger.error).not.toHaveBeenCalled();
  });
});
