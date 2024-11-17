import axios from 'axios';

import type { IMicrosservicoPedido } from '../../interfaces/microsservico';
import { Logger } from '../logs/logger';

export class MicrosservicoPedido implements IMicrosservicoPedido {
  public async atualizarStatusPagamento({
    id,
    pagamentoStatus,
  }: {
    id: string;
    pagamentoStatus: string;
  }): Promise<{ message: string }> {
    const data = await axios
      .patch<{ message: string }>(
        `http://localhost:3000/pedidos/pedido/${id}/status-pagamento`,
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
