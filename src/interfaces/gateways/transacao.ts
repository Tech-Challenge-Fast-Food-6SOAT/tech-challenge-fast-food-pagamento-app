import type { Transacao } from '../../domain/entities';

export interface ITransacaoGateway {
  criar: (transacao: Omit<Transacao, 'id'>) => Promise<Transacao>;
  editar: (params: {
    id: string;
    value: Record<string, unknown>;
  }) => Promise<Transacao | null>;
  buscarTransacaoPorPedidoId: (pedidoId: string) => Promise<Transacao | null>;
}
