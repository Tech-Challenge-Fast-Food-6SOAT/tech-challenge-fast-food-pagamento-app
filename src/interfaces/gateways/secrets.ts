export interface ISecretsGateway {
  getSecretValue: (secretName: string) => Promise<string>;
}
