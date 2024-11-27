/* eslint-disable no-process-env */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dotenv from 'dotenv';
import pgPromise from 'pg-promise';

import { Logger } from '../../logs/logger';
import type { Connection } from './connection';
import { createTransacoesSchemaSQL } from './schema';

dotenv.config();

export class PgPromiseConnectionAdapter implements Connection {
  public pgp: pgPromise.IDatabase<unknown>;

  public static instance: PgPromiseConnectionAdapter;

  private constructor() {
    const initOptions = {
      connect() {
        Logger.info('PostgreSQL is connected!');
      },
      disconnect() {
        Logger.info('PostgreSQL disconnected');
      },
      error(err: unknown) {
        if (err instanceof Error) {
          Logger.error(`PostgreSQL connection error: ${err.message}`);
        } else {
          Logger.error('PostgreSQL connection error: unknown error');
        }
      },
    };

    const pgp = pgPromise(initOptions);

    this.pgp = pgp({
      connectionString: process.env.POSTGRESQL_CONNECTION_STRING_PAGAMENTO,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  public static async getInstance(): Promise<PgPromiseConnectionAdapter> {
    if (!PgPromiseConnectionAdapter.instance) {
      PgPromiseConnectionAdapter.instance = new PgPromiseConnectionAdapter();
      await PgPromiseConnectionAdapter.instance.pgp.query(
        createTransacoesSchemaSQL,
        []
      );
    }
    return PgPromiseConnectionAdapter.instance;
  }

  public async query<T>(statement: string, params: unknown[]): Promise<T> {
    return this.pgp.query(statement, params);
  }
}

export default PgPromiseConnectionAdapter;
