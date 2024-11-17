/* eslint-disable no-underscore-dangle */
import type { IPedidoGateway } from '../../interfaces/gateways/pedido';
import type { IMicrosservicoPedido } from '../../interfaces/microsservico';

export class PedidoGateway implements IPedidoGateway {
  public constructor(
    private readonly microsservicoPedido: IMicrosservicoPedido
  ) {}

  public async atualizarStatusPagamento({
    id,
    pagamentoStatus,
  }: {
    id: string;
    pagamentoStatus: string;
  }): Promise<{ message: string }> {
    return this.microsservicoPedido.atualizarStatusPagamento({
      id,
      pagamentoStatus,
    });
  }
}
