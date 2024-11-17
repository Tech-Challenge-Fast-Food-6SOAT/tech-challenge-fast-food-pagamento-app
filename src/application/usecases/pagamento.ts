import type {
  PagamentoGateway,
  PedidoGateway,
  TransacaoGateway,
} from '../../adapters/gateways';
import type { Pedido, Transacao } from '../../domain/entities';
import { PagamentoStatus } from '../../value-objects';

export class PagamentoUseCase {
  public constructor(
    private readonly transacaoGateway: TransacaoGateway,
    private readonly pagamentoGateway: PagamentoGateway,
    private readonly pedidoGateway: PedidoGateway
  ) {}

  public async gerarPagamento(pedido: Pedido): Promise<{ qrCode: string }> {
    const output = await this.pagamentoGateway.gerarPagamento(pedido);
    await this.transacaoGateway.criar({
      pedidoId: pedido.id,
      valor: pedido.total,
      pagamentoStatus: new PagamentoStatus('Pendente'),
      idTransacaoExterna: output.idTransacaoExterna,
    });

    return { qrCode: output.qrCode };
  }

  public async atualizarStatusPagamento(body: {
    id: string;
    status: string;
  }): Promise<void> {
    const { idTransacaoExterna, pagamentoStatus } =
      this.pagamentoGateway.converterMensagemWebhook(body);
    const transacao = await this.transacaoGateway.buscarPorIdTransacaoExterna(
      idTransacaoExterna
    );
    if (!transacao) throw new Error('Transação não encontrada');
    await this.transacaoGateway.editar({
      id: transacao.id,
      value: { pagamentoStatus: pagamentoStatus.status },
    });
    await this.pedidoGateway.atualizarStatusPagamento({
      id: transacao.pedidoId,
      pagamentoStatus: pagamentoStatus.status,
    });
  }

  public async buscarTransacaoPorPedidoId(
    pedidoId: string
  ): Promise<Transacao> {
    const transacao = await this.transacaoGateway.buscarTransacaoPorPedidoId(
      pedidoId
    );
    if (!transacao) throw new Error('Transação não encontrada');
    return transacao;
  }
}
