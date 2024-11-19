import type { DbConnection } from '../../../interfaces/db/connection';
import type { Connection } from './connection';

export class TransacaoDbConnection implements DbConnection {
  public readonly connection: Connection;

  public constructor(connection: Connection) {
    this.connection = connection;
  }

  public async criar<T>(params: Record<string, unknown>): Promise<T> {
    const keys = Object.keys(params);
    const values = Object.values(params);

    if (keys.length === 0) {
      throw new Error('No parameters provided for the insert.');
    }

    const columns = keys.join(', ');
    const valuePlaceholders = keys
      .map((_, index) => `$${index + 1}`)
      .join(', ');
    const query = `INSERT INTO lanchonete.transacoes (${columns}) VALUES (${valuePlaceholders}) RETURNING *`;
    const result = (await this.connection.query(query, values)) as T;
    return result;
  }

  public async editar<T>(params: {
    id: string;
    value: Record<string, unknown>;
  }): Promise<T | null> {
    const { id, value } = params;
    const keys = Object.keys(value);
    const values = Object.values(value);

    if (keys.length === 0) {
      throw new Error('No values provided for the update.');
    }

    const setClauses = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    const query = `UPDATE lanchonete.transacoes SET ${setClauses} WHERE id = $${
      keys.length + 1
    } RETURNING *`;

    const result = (await this.connection.query(query, [...values, id])) as T;
    return result;
  }

  public async buscarUm<T>(params: Record<string, unknown>): Promise<T | null> {
    const keys = Object.keys(params);
    const values = Object.values(params);

    if (keys.length === 0) {
      throw new Error('No parameters provided for the query.');
    }

    const whereClauses = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(' AND ');
    const query = `SELECT * FROM lanchonete.transacoes WHERE ${whereClauses}`;
    const result = (await this.connection.query(query, values)) as T[];
    return result[0] || null;
  }
}
