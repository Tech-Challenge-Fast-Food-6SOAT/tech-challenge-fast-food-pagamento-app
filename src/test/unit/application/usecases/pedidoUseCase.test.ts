/* eslint-disable @typescript-eslint/unbound-method */
import type {
  PagamentoGateway,
  PedidoGateway,
  TransacaoGateway,
} from '@/adapters/gateways';
import { PagamentoUseCase } from '@/application/usecases';
import { PagamentoStatus } from '@/domain/value-objects';

describe('PagamentoUseCase', () => {
  const transacaoGateway = {
    criar: jest.fn(),
    editar: jest.fn(),
    buscarTransacaoPorPedidoId: jest.fn(),
    buscarPorIdTransacaoExterna: jest.fn(),
  } as unknown as TransacaoGateway;
  const pagamentoGateway = {
    gerarPagamento: jest.fn(),
    converterMensagemWebhook: jest.fn(),
  } as unknown as PagamentoGateway;
  const pedidoGateway = {
    atualizarStatusPagamento: jest.fn(),
  } as unknown as PedidoGateway;
  const pagamentoUseCase = new PagamentoUseCase(
    transacaoGateway,
    pagamentoGateway,
    pedidoGateway
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('gerarPagamento', () => {
    it('should create a transacao and return a qrcode', async () => {
      const pedido = { id: 'IDPDO-123', total: 100 };
      const pagamentoGatewayOutput = {
        idTransacaoExterna: '123',
        qrCode: 'qrcode',
      };
      (pagamentoGateway.gerarPagamento as jest.Mock).mockResolvedValue(
        pagamentoGatewayOutput
      );
      (transacaoGateway.criar as jest.Mock).mockReturnValue(undefined);

      const result = await pagamentoUseCase.gerarPagamento(pedido);
      expect(result).toEqual({ qrCode: pagamentoGatewayOutput.qrCode });
      expect(pagamentoGateway.gerarPagamento).toHaveBeenCalledWith(pedido);
      expect(pagamentoGateway.gerarPagamento).toHaveBeenCalledTimes(1);
      expect(transacaoGateway.criar).toHaveBeenCalledWith({
        pedidoId: pedido.id,
        valor: pedido.total,
        pagamentoStatus: new PagamentoStatus('Pendente'),
        idTransacaoExterna: pagamentoGatewayOutput.idTransacaoExterna,
      });
      expect(transacaoGateway.criar).toHaveBeenCalledTimes(1);
    });
  });

  describe('atualizarStatusPagamento', () => {
    it('should update pagamentoStatus', async () => {
      const body = { id: 'IDTE-123', status: 'paid' };
      const pagamentoStatus = new PagamentoStatus('Aprovado');
      const transacao = { id: '123', pedidoId: 'IDPDO-123' };

      (pagamentoGateway.converterMensagemWebhook as jest.Mock).mockReturnValue({
        idTransacaoExterna: 'IDTE-123',
        pagamentoStatus,
      });
      (
        transacaoGateway.buscarPorIdTransacaoExterna as jest.Mock
      ).mockReturnValue(transacao);
      (pedidoGateway.atualizarStatusPagamento as jest.Mock).mockReturnValue(
        undefined
      );
      await pagamentoUseCase.atualizarStatusPagamento(body);

      expect(pagamentoGateway.converterMensagemWebhook).toHaveBeenCalledWith(
        body
      );
      expect(pagamentoGateway.converterMensagemWebhook).toHaveBeenCalledTimes(
        1
      );
      expect(transacaoGateway.buscarPorIdTransacaoExterna).toHaveBeenCalledWith(
        'IDTE-123'
      );
      expect(
        transacaoGateway.buscarPorIdTransacaoExterna
      ).toHaveBeenCalledTimes(1);
      expect(transacaoGateway.editar).toHaveBeenCalledWith({
        id: transacao.id,
        value: { pagamento_status: pagamentoStatus.status },
      });
      expect(transacaoGateway.editar).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if transacao is not found', async () => {
      const body = { id: 'IDTE-123', status: 'paid' };
      (pagamentoGateway.converterMensagemWebhook as jest.Mock).mockReturnValue({
        idTransacaoExterna: 'IDTE-123',
        pagamentoStatus: new PagamentoStatus('Aprovado'),
      });
      (
        transacaoGateway.buscarPorIdTransacaoExterna as jest.Mock
      ).mockReturnValue(null);

      const result = pagamentoUseCase.atualizarStatusPagamento(body);
      await expect(result).rejects.toThrow('Transação não encontrada');
    });
  });

  describe('buscarTransacaoPorPedidoId', () => {
    it('should return transacao', async () => {
      const pedidoId = 'IDPDO-123';
      const transacao = { id: '123', pedidoId: 'IDPDO-123' };

      (
        transacaoGateway.buscarTransacaoPorPedidoId as jest.Mock
      ).mockReturnValue(transacao);
      const result = await pagamentoUseCase.buscarTransacaoPorPedidoId(
        pedidoId
      );

      expect(result).toEqual(transacao);
      expect(transacaoGateway.buscarTransacaoPorPedidoId).toHaveBeenCalledWith(
        pedidoId
      );
      expect(transacaoGateway.buscarTransacaoPorPedidoId).toHaveBeenCalledTimes(
        1
      );
    });

    it('should throw an error if transacao is not found', async () => {
      (
        transacaoGateway.buscarTransacaoPorPedidoId as jest.Mock
      ).mockReturnValue(null);

      const result = pagamentoUseCase.buscarTransacaoPorPedidoId('IDPDO-123');
      await expect(result).rejects.toThrow('Transação não encontrada');
    });
  });
});
