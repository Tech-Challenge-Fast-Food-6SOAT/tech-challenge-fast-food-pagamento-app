/* eslint-disable no-process-env */
import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import dotenv from 'dotenv';

dotenv.config();

export class SecretsManager {
  private readonly client: SecretsManagerClient;

  public constructor() {
    this.client = new SecretsManagerClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        sessionToken: process.env.AWS_SESSION_TOKEN as string,
      },
    });
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
