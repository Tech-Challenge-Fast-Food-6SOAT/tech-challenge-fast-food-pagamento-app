/* eslint-disable @typescript-eslint/init-declarations */
import { SecretsGateway } from '@/adapters/gateways';
import { SecretsManager } from '@/infra/aws';

jest.mock('@/infra/aws');

describe('SecretsGateway', () => {
  let secretsGateway: SecretsGateway;
  let secretsManager: jest.Mocked<SecretsManager>;

  beforeEach(() => {
    secretsManager = new SecretsManager() as jest.Mocked<SecretsManager>;
    (SecretsManager as jest.Mock).mockImplementation(() => secretsManager);
    secretsGateway = new SecretsGateway();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the secret value', async () => {
    const secretName = 'test-secret';
    const secretValue = 'mocked-secret-value';

    secretsManager.getSecretValue.mockResolvedValue(secretValue);

    const result = await secretsGateway.getSecretValue(secretName);

    expect(result).toEqual(secretValue);
  });
});
