import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';

export class SecretsManager {
  private readonly client: SecretsManagerClient;

  public constructor() {
    this.client = new SecretsManagerClient();
  }

  public async getSecretValue(secretName: string): Promise<string> {
    const response = await this.client.send(
      new GetSecretValueCommand({
        SecretId: secretName,
      })
    );
    return response.SecretString as string;
  }
}
