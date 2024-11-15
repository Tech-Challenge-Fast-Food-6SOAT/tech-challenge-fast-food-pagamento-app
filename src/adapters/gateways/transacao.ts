/* eslint-disable no-underscore-dangle */
import { Transacao } from '../../domain/entities';
import type { DbConnection } from '../../interfaces/db/connection';
import type { ITransacaoGateway } from '../../interfaces/gateways';

export class TransacaoGateway implements ITransacaoGateway {
  public constructor(private readonly dbConnection: DbConnection) {}

  public async criar(
    transacao: Omit<Transacao, 'data' | 'id'>
  ): Promise<Transacao> {
    const transacaoCriada = await this.dbConnection.criar<{
      _id: string;
      createdAt: Date;
    }>({ ...transacao, pagamentoStatus: transacao.pagamentoStatus.status });
    return new Transacao(
      transacaoCriada._id,
      transacao.pedidoId,
      transacao.valor,
      transacao.pagamentoStatus,
      transacaoCriada.createdAt,
      transacao.idTransacaoExterna
    );
  }

  public async editar(params: {
    id: string;
    value: object;
  }): Promise<Transacao | null> {
    const transacaoAtualizada = await this.dbConnection.editar<
      Transacao & { createdAt: Date }
    >(params);
    if (!transacaoAtualizada) return null;
    return new Transacao(
      transacaoAtualizada.id,
      transacaoAtualizada.pedidoId,
      transacaoAtualizada.valor,
      transacaoAtualizada.pagamentoStatus,
      transacaoAtualizada.createdAt,
      transacaoAtualizada.idTransacaoExterna
    );
  }

  public async buscarTransacaoPorPedidoId(
    pedidoId: string
  ): Promise<Transacao | null> {
    const transacao = await this.dbConnection.buscarUm<
      Transacao & { createdAt: Date }
    >({
      pedidoId,
    });
    if (!transacao) return null;
    return new Transacao(
      transacao.id,
      transacao.pedidoId,
      transacao.valor,
      transacao.pagamentoStatus,
      transacao.createdAt,
      transacao.idTransacaoExterna
    );
  }

  public async buscarPorIdTransacaoExterna(
    idTransacaoExterna: string
  ): Promise<Transacao | null> {
    const transacao = await this.dbConnection.buscarUm<
      Transacao & { createdAt: Date }
    >({
      idTransacaoExterna,
    });
    if (!transacao) return null;
    return new Transacao(
      transacao.id,
      transacao.pedidoId,
      transacao.valor,
      transacao.pagamentoStatus,
      transacao.createdAt,
      transacao.idTransacaoExterna
    );
  }
}
