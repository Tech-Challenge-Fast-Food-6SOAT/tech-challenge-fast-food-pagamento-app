import axios from 'axios';

import type { ISecretsGateway } from '../../interfaces/gateways';
import type { IMicrosservicoPedido } from '../../interfaces/microsservico';
import { Logger } from '../logs/logger';

export class MicrosservicoPedido implements IMicrosservicoPedido {
  public constructor(private readonly secretsGateway: ISecretsGateway) {}

  public async atualizarStatusPagamento({
    id,
    pagamentoStatus,
  }: {
    id: string;
    pagamentoStatus: string;
  }): Promise<{ message: string }> {
    const baseUrl = await this.secretsGateway.getSecretValue('LANCHONETE_API');
    const data = await axios
      .patch<{ message: string }>(
        `${baseUrl}/pedidos/pedido/${id}/status-pagamento`,
        {
          pagamentoStatus,
        }
      )
      .then((response) => response.data)
      .catch((error) => {
        Logger.error(error);
        throw error;
      });
    return data;
  }
}
