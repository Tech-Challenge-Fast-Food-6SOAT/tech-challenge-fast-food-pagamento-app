import type { Pedido } from '../../domain/entities';
import type { IPagamentoGateway } from '../../interfaces/gateways';
import type { IPlataformaPagamento } from '../../interfaces/plataformaPagamento';
import type { PagamentoStatusEnum } from '../../value-objects';
import { PagamentoStatus } from '../../value-objects';

export class PagamentoGateway implements IPagamentoGateway {
  public constructor(
    private readonly plataformaPagamento: IPlataformaPagamento
  ) {}

  public async gerarPagamento(
    pedido: Pedido
  ): Promise<{ idTransacaoExterna: string; qrCode: string }> {
    return this.plataformaPagamento.executarTransacao(pedido);
  }

  public converterMensagemWebhook(mensagem: { id: string; status: string }): {
    idTransacaoExterna: string;
    pagamentoStatus: PagamentoStatus;
  } {
    const { idTransacaoExterna, pagamentoStatus } =
      this.plataformaPagamento.converterMensagemWebhook(mensagem);
    return {
      idTransacaoExterna,
      pagamentoStatus: new PagamentoStatus(
        pagamentoStatus as PagamentoStatusEnum
      ),
    };
  }
}
