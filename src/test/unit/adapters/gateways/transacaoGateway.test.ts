/* eslint-disable no-underscore-dangle */
import { TransacaoGateway } from '@/adapters/gateways';
import { Transacao } from '@/domain/entities';
import { PagamentoStatus } from '@/domain/value-objects';
import type { TransacaoDB } from '@/interfaces/db';
import type { DbConnection } from '@/interfaces/db/connection';

describe('TransacaoGateway', () => {
  const dbConnection = {
    buscarUm: jest.fn(),
    criar: jest.fn(),
    editar: jest.fn(),
  } as unknown as DbConnection;
  const transacaoGateway = new TransacaoGateway(dbConnection);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criar', () => {
    it('should create a transacao', async () => {
      const transacao = {
        pedidoId: 'IDPDO-123',
        valor: 10,
        pagamentoStatus: new PagamentoStatus('Pendente'),
        idTransacaoExterna: 'IDTE-123',
      } as unknown as Omit<Transacao, 'data' | 'id'>;

      const transacaoCriada = {
        id: 'ID-123',
        ...transacao,
        created_at: new Date(),
      };
      (dbConnection.criar as jest.Mock).mockResolvedValue(transacaoCriada);

      const result = await transacaoGateway.criar(transacao);

      expect(result).toEqual(
        new Transacao(
          transacaoCriada.id,
          transacao.pedidoId,
          transacao.valor,
          transacao.pagamentoStatus,
          transacaoCriada.created_at,
          transacao.idTransacaoExterna
        )
      );
      expect(dbConnection.criar).toHaveBeenCalledWith({
        pedido_id: transacao.pedidoId,
        valor: transacao.valor,
        pagamento_status: transacao.pagamentoStatus.status,
        id_transacao_externa: transacao.idTransacaoExterna,
      });
    });
  });

  describe('editar', () => {
    it('should edit a transacao', async () => {
      const transacaoAtualizada = {
        id: 'ID-123',
        pedido_id: 'IDPDO-123',
        valor: 10,
        pagamento_status: 'Pendente',
        id_transacao_externa: 'IDTE-123',
        created_at: new Date(),
      } as unknown as TransacaoDB;

      (dbConnection.editar as jest.Mock).mockResolvedValue(transacaoAtualizada);

      const params = { id: 'ID-123', value: { pagamento_status: 'Aprovado' } };
      const result = await transacaoGateway.editar(params);

      expect(result).toEqual(
        new Transacao(
          transacaoAtualizada.id,
          transacaoAtualizada.pedido_id,
          transacaoAtualizada.valor,
          transacaoAtualizada.pagamento_status,
          transacaoAtualizada.created_at,
          transacaoAtualizada.id_transacao_externa
        )
      );
      expect(dbConnection.editar).toHaveBeenCalledWith(params);
    });

    it('should return null if transacao is not found', async () => {
      const params = { id: '123', value: { pagamento_status: 'Aprovado' } };
      (dbConnection.editar as jest.Mock).mockResolvedValue(null);
      const result = await transacaoGateway.editar(params);
      expect(result).toBeNull();
      expect(dbConnection.editar).toHaveBeenCalledWith(params);
    });
  });

  describe('buscarTransacaoPorPedidoId', () => {
    const pedidoId = 'IDPDO-123';

    it('should return a transacao', async () => {
      const transacao = {
        id: 'ID-123',
        pedido_id: 'IDPDO-123',
        valor: 10,
        pagamento_status: 'Pendente',
        id_transacao_externa: 'IDTE-123',
        created_at: new Date(),
      } as unknown as TransacaoDB;

      (dbConnection.buscarUm as jest.Mock).mockResolvedValue(transacao);

      const result = await transacaoGateway.buscarTransacaoPorPedidoId(
        pedidoId
      );

      expect(result).toEqual(
        new Transacao(
          transacao.id,
          transacao.pedido_id,
          transacao.valor,
          transacao.pagamento_status,
          transacao.created_at,
          transacao.id_transacao_externa
        )
      );
      expect(dbConnection.buscarUm).toHaveBeenCalledWith({
        pedido_id: pedidoId,
      });
    });

    it('should return null if transacao is not found', async () => {
      (dbConnection.buscarUm as jest.Mock).mockResolvedValue(null);
      const result = await transacaoGateway.buscarTransacaoPorPedidoId(
        pedidoId
      );
      expect(result).toBeNull();
      expect(dbConnection.buscarUm).toHaveBeenCalledWith({
        pedido_id: pedidoId,
      });
    });
  });

  describe('buscarPorIdTransacaoExterna', () => {
    const idTransacaoExterna = 'IDPDO-123';

    it('should return a transacao', async () => {
      const transacaoAtualizada = {
        id: 'ID-123',
        pedido_id: 'IDPDO-123',
        valor: 10,
        pagamento_status: 'Pendente',
        id_transacao_externa: 'IDTE-123',
        created_at: new Date(),
      } as unknown as TransacaoDB;

      (dbConnection.buscarUm as jest.Mock).mockResolvedValue(
        transacaoAtualizada
      );

      const result = await transacaoGateway.buscarPorIdTransacaoExterna(
        idTransacaoExterna
      );

      expect(result).toEqual(
        new Transacao(
          transacaoAtualizada.id,
          transacaoAtualizada.pedido_id,
          transacaoAtualizada.valor,
          transacaoAtualizada.pagamento_status,
          transacaoAtualizada.created_at,
          transacaoAtualizada.id_transacao_externa
        )
      );
      expect(dbConnection.buscarUm).toHaveBeenCalledWith({
        id_transacao_externa: idTransacaoExterna,
      });
    });

    it('should return null if transacao is not found', async () => {
      (dbConnection.buscarUm as jest.Mock).mockResolvedValue(null);
      const result = await transacaoGateway.buscarPorIdTransacaoExterna(
        idTransacaoExterna
      );
      expect(result).toBeNull();
      expect(dbConnection.buscarUm).toHaveBeenCalledWith({
        id_transacao_externa: idTransacaoExterna,
      });
    });
  });
});
