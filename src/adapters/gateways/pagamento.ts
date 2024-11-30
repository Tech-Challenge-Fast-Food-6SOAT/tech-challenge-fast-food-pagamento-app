import type { Pedido } from '../../domain/entities';
import type { PagamentoStatusEnum } from '../../domain/value-objects';
import { PagamentoStatus } from '../../domain/value-objects';
import type { IPagamentoGateway } from '../../interfaces/gateways';
import type { IPlataformaPagamento } from '../../interfaces/plataformaPagamento';

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
