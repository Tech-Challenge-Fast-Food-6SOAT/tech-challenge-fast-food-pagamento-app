/* eslint-disable @typescript-eslint/init-declarations */
import {
  PgPromiseConnectionAdapter,
  TransacaoDbConnection,
} from '@/infra/database/postgreSQL';

jest.mock('@/infra/logs/logger', () => ({
  Logger: { info: jest.fn() },
}));

jest.mock('@/infra/database/postgreSQL/pgPromiseConnectionAdapter');

describe('TransacaoDbConnection', () => {
  let transacaoDbConnection: TransacaoDbConnection;
  let mockConnection: { query: jest.Mock };

  beforeEach(async () => {
    mockConnection = {
      query: jest.fn(),
    };

    (PgPromiseConnectionAdapter.getInstance as jest.Mock).mockReturnValue({
      query: mockConnection.query,
    });
    const connection = await PgPromiseConnectionAdapter.getInstance();
    transacaoDbConnection = new TransacaoDbConnection(connection);
  });

  it('should create a transacao correctly and return it', async () => {
    const params = {
      pedido_id: 'pedido-123',
      valor: 10,
      pagamento_status: 'Aprovado',
      id_transacao_externa: 'transacao-externa-123',
    };

    const expectedResult = {
      id: 'generated-id',
      ...params,
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockConnection.query.mockResolvedValue(expectedResult);

    const result = await transacaoDbConnection.criar(params);

    expect(result).toEqual(expectedResult);
    expect(mockConnection.query).toHaveBeenCalledWith(
      'INSERT INTO lanchonete.transacoes (pedido_id, valor, pagamento_status, id_transacao_externa) VALUES ($1, $2, $3, $4) RETURNING *',
      Object.values(params)
    );
  });

  it('should throw an error if no parameters are provided', async () => {
    const result = transacaoDbConnection.criar({});
    await expect(result).rejects.toThrow(
      'No parameters provided for the insert.'
    );
  });

  describe('editar', () => {
    it('should edit a transacao correctly and return it', async () => {
      const params = {
        id: 'transacao-123',
        value: {
          pedido_id: 'pedido-123',
          valor: 10,
          pagamento_status: 'Aprovado',
          id_transacao_externa: 'transacao-externa-123',
        },
      };

      const expectedResult = {
        id: params.id,
        ...params.value,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockConnection.query.mockResolvedValue(expectedResult);

      const result = await transacaoDbConnection.editar(params);

      expect(result).toEqual(expectedResult);
      expect(mockConnection.query).toHaveBeenCalledWith(
        'UPDATE lanchonete.transacoes SET pedido_id = $1, valor = $2, pagamento_status = $3, id_transacao_externa = $4 WHERE id = $5 RETURNING *',
        Object.values(params.value).concat(params.id)
      );
    });

    it('should throw an error if no values are provided', async () => {
      const result = transacaoDbConnection.editar({
        id: 'transacao-123',
        value: {},
      });
      await expect(result).rejects.toThrow(
        'No values provided for the update.'
      );
    });
  });

  describe('buscarUm', () => {
    it('should find a transacao correctly and return it', async () => {
      const params = {
        pedido_id: 'pedido-123',
      };

      const expectedResult = {
        id: 'transacao-123',
        pedido_id: params.pedido_id,
        valor: 10,
        pagamento_status: 'Aprovado',
        id_transacao_externa: 'transacao-externa-123',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockConnection.query.mockResolvedValue([expectedResult]);

      const result = await transacaoDbConnection.buscarUm(params);

      expect(result).toEqual(expectedResult);
      expect(mockConnection.query).toHaveBeenCalledWith(
        'SELECT * FROM lanchonete.transacoes WHERE pedido_id = $1',
        Object.values(params)
      );
    });

    it('should return null if no transacao is found', async () => {
      const params = {
        pedido_id: 'pedido-123',
      };
      mockConnection.query.mockResolvedValue([]);

      const result = await transacaoDbConnection.buscarUm(params);

      expect(result).toBeNull();
      expect(mockConnection.query).toHaveBeenCalledWith(
        'SELECT * FROM lanchonete.transacoes WHERE pedido_id = $1',
        Object.values(params)
      );
    });

    it('should throw an error if no parameters are provided', async () => {
      const result = transacaoDbConnection.buscarUm({});
      await expect(result).rejects.toThrow(
        'No parameters provided for the query.'
      );
    });
  });
});
