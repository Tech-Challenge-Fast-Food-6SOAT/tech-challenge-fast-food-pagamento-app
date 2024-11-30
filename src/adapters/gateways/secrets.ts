import { SecretsManager } from '../../infra/aws';
import type { ISecretsGateway } from '../../interfaces/gateways';

export class SecretsGateway implements ISecretsGateway {
  private readonly secretsManager: SecretsManager;

  public constructor() {
    this.secretsManager = new SecretsManager();
  }

  public async getSecretValue(secretName: string): Promise<string> {
    return this.secretsManager.getSecretValue(secretName);
  }
}
