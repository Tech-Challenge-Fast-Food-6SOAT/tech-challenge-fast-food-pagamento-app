import { TransacaoModel } from '../models';
import { MongoDbConnection } from './db-connections';

export class TransacaoDbConnection extends MongoDbConnection {
  public constructor() {
    super(TransacaoModel);
  }
}
