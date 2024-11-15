/* eslint-disable no-underscore-dangle */

import type { PagamentoStatus } from '../../value-objects';

export class Transacao {
  public constructor(
    private readonly _id: string,
    private readonly _pedidoId: string,
    private readonly _valor: number,
    private readonly _pagamentoStatus: PagamentoStatus,
    private readonly _data: Date,
    private readonly _idTransacaoExterna: string
  ) {}

  public get id(): string {
    return this._id;
  }

  public get pedidoId(): string {
    return this._pedidoId;
  }

  public get valor(): number {
    return this._valor;
  }

  public get pagamentoStatus(): PagamentoStatus {
    return this._pagamentoStatus;
  }

  public get data(): Date {
    return this._data;
  }

  public get idTransacaoExterna(): string {
    return this._idTransacaoExterna;
  }
}
