/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-underscore-dangle */
import type { Model as ModelType } from 'mongoose';

import type { DbConnection } from '../../../../interfaces/db/connection';

export class MongoDbConnection implements DbConnection {
  public constructor(private readonly Model: ModelType<any>) {}

  public async criar<T = unknown>(params: object): Promise<T> {
    const newModel = new this.Model(params);
    await newModel.save();
    return { _id: newModel._id as unknown as string } as T;
  }

  public async editar<T = unknown>(params: {
    id: string;
    value: object;
  }): Promise<T | null> {
    const { id, value } = params;
    return this.Model.findByIdAndUpdate(id, value, { new: true });
  }

  public async buscar<T = unknown>(params: object): Promise<T[]> {
    return this.Model.find(params);
  }

  public async buscarUm<T = unknown>(params: object): Promise<T | null> {
    return this.Model.findOne(params);
  }

  public async excluir(id: string): Promise<void> {
    await this.Model.findByIdAndDelete(id);
  }
}
