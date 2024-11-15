import type { Pedido } from '../../domain/entities';
import type { PagamentoStatus } from '../../value-objects';

export interface IPagamentoGateway {
  gerarPagamento: (pedido: Pedido) => Promise<object>;
  converterMensagemWebhook: (mensagem: { id: string; status: string }) => {
    idTransacaoExterna: string;
    pagamentoStatus: PagamentoStatus;
  };
}
