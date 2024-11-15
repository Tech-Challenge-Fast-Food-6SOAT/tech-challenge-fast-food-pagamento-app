import { Logger } from '../infra/logs/logger';
import { App } from './app';

App.start().catch((error) => {
  Logger.error('Failed to start the app:', error);
});
