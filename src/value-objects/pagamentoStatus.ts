/* eslint-disable no-underscore-dangle */
export type PagamentoStatusEnum = 'Aprovado' | 'Pendente' | 'Recusado';

export class PagamentoStatus {
  public constructor(private readonly _status: PagamentoStatusEnum) {}

  public get status(): PagamentoStatusEnum {
    return this._status;
  }
}
