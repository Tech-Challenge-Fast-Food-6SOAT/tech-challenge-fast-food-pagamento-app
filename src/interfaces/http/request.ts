import type { Pedido } from '../../domain/entities';

export interface HttpRequest<T = any> {
  body: {
    pedido: Pedido;
    id: string;
    status: string;
  };
  headers: T;
  params: { pedidoId: string };
  query?: T;
}
