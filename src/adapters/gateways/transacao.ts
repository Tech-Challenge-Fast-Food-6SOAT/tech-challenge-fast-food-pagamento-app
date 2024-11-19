/* eslint-disable no-underscore-dangle */
import { Transacao } from '../../domain/entities';
import type { TransacaoDB } from '../../interfaces/db';
import type { DbConnection } from '../../interfaces/db/connection';
import type { ITransacaoGateway } from '../../interfaces/gateways';

export class TransacaoGateway implements ITransacaoGateway {
  public constructor(private readonly dbConnection: DbConnection) {}

  public async criar(
    transacao: Omit<Transacao, 'data' | 'id'>
  ): Promise<Transacao> {
    const transacaoCriada = await this.dbConnection.criar<TransacaoDB>({
      pedido_id: transacao.pedidoId,
      valor: transacao.valor,
      pagamento_status: transacao.pagamentoStatus.status,
      id_transacao_externa: transacao.idTransacaoExterna,
    });
    return new Transacao(
      transacaoCriada.id,
      transacao.pedidoId,
      transacao.valor,
      transacao.pagamentoStatus,
      transacaoCriada.created_at,
      transacao.idTransacaoExterna
    );
  }

  public async editar(params: {
    id: string;
    value: Record<string, unknown>;
  }): Promise<Transacao | null> {
    const transacaoAtualizada = await this.dbConnection.editar<TransacaoDB>(
      params
    );
    if (!transacaoAtualizada) return null;
    return new Transacao(
      transacaoAtualizada.id,
      transacaoAtualizada.pedido_id,
      transacaoAtualizada.valor,
      transacaoAtualizada.pagamento_status,
      transacaoAtualizada.created_at,
      transacaoAtualizada.id_transacao_externa
    );
  }

  public async buscarTransacaoPorPedidoId(
    pedidoId: string
  ): Promise<Transacao | null> {
    const transacao = await this.dbConnection.buscarUm<TransacaoDB>({
      pedido_id: pedidoId,
    });
    if (!transacao) return null;
    return new Transacao(
      transacao.id,
      transacao.pedido_id,
      transacao.valor,
      transacao.pagamento_status,
      transacao.created_at,
      transacao.id_transacao_externa
    );
  }

  public async buscarPorIdTransacaoExterna(
    idTransacaoExterna: string
  ): Promise<Transacao | null> {
    const transacao = await this.dbConnection.buscarUm<TransacaoDB>({
      id_transacao_externa: idTransacaoExterna,
    });
    if (!transacao) return null;
    return new Transacao(
      transacao.id,
      transacao.pedido_id,
      transacao.valor,
      transacao.pagamento_status,
      transacao.created_at,
      transacao.id_transacao_externa
    );
  }
}
