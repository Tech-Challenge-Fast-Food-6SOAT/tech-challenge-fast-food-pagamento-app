/* eslint-disable @typescript-eslint/init-declarations */
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

import { SecretsManager } from '@/infra/aws';

jest.mock('@aws-sdk/client-secrets-manager');

describe('SecretsManager', () => {
  let secretsManager: SecretsManager;
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockSend = jest.fn();
    (SecretsManagerClient as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }));
    secretsManager = new SecretsManager();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the secret value', async () => {
    const secretName = 'test-secret';
    const secretValue = 'mocked-secret-value';

    mockSend.mockResolvedValueOnce({
      SecretString: secretValue,
    });

    const result = await secretsManager.getSecretValue(secretName);

    expect(mockSend).toHaveBeenCalledWith(expect.any(GetSecretValueCommand));
    expect(result).toBe(secretValue);
  });
});
