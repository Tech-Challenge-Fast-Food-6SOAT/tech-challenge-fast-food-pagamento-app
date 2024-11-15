import type { Pedido } from '../../domain/entities';

export interface IPlataformaPagamento {
  executarTransacao: (
    pedido: Pedido
  ) => Promise<{ idTransacaoExterna: string; qrCode: string }>;
  converterMensagemWebhook: (mensagem: { id: string; status: string }) => {
    idTransacaoExterna: string;
    pagamentoStatus: string;
  };
}
