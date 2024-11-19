import type { PagamentoStatus } from '../../domain/value-objects';

export interface TransacaoDB {
  id: string;
  pedido_id: string;
  valor: number;
  pagamento_status: PagamentoStatus;
  created_at: Date;
  id_transacao_externa: string;
}
