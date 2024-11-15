/* eslint-disable no-underscore-dangle */
import type { Produto } from '../../types/produto';
import type { PagamentoStatus, Status } from '../../value-objects';

export class Pedido {
  public constructor(
    private readonly _id: string,
    private readonly _cliente: string | null,
    private readonly _produtos: { produto: Produto; quantidade: number }[],
    private readonly _total: number,
    private readonly _status: Status,
    private readonly _pagamentoStatus: PagamentoStatus,
    private readonly _senha: string
  ) {}

  public get id(): string {
    return this._id;
  }

  public get cliente(): string | null {
    return this._cliente;
  }

  public get produtos(): { produto: Produto; quantidade: number }[] {
    return this._produtos;
  }

  public get status(): Status {
    return this._status;
  }

  public get total(): number {
    return this._total;
  }

  public get senha(): string {
    return this._senha;
  }

  public get pagamentoStatus(): PagamentoStatus {
    return this._pagamentoStatus;
  }
}
