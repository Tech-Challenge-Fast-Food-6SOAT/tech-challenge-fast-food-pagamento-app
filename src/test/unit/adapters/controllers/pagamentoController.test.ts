/* eslint-disable @typescript-eslint/init-declarations */
import { PagamentoController } from '@/adapters/controllers';
import type { PagamentoUseCase } from '@/application/usecases';
import type { HttpRequest, HttpResponse } from '@/interfaces/http';

describe('PagamentoController', () => {
  const pagamentoUseCase = {
    buscarTransacaoPorPedidoId: jest.fn(),
    gerarPagamento: jest.fn(),
    atualizarStatusPagamento: jest.fn(),
  } as unknown as PagamentoUseCase;
  const pagamentoController = new PagamentoController(pagamentoUseCase);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buscarTransacaoPorPedidoId', () => {
    it('should return transacao document and statusCode 200', async () => {
      const transacao = {
        id: 'ID-123',
        pedidoId: 'IDPDO-123',
        valor: 100,
        pagamentoStatus: 'Aprovado',
        data: new Date(),
        idTransacaoExterna: 'IDTE-123',
      };
      (
        pagamentoUseCase.buscarTransacaoPorPedidoId as jest.Mock
      ).mockResolvedValue(transacao);

      const request = { params: { pedidoId: 'IDPDO-123' } } as HttpRequest;
      const response: HttpResponse =
        await pagamentoController.buscarTransacaoPorPedidoId(request);

      expect(response.statusCode).toBe(200);
      expect(response.data).toEqual(transacao);
    });

    it('should return 500 if an error occurs', async () => {
      (
        pagamentoUseCase.buscarTransacaoPorPedidoId as jest.Mock
      ).mockRejectedValue(new Error('Erro interno'));
      const request = { params: { pedidoId: 'IDPDO-123' } } as HttpRequest;
      const response: HttpResponse =
        await pagamentoController.buscarTransacaoPorPedidoId(request);

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Erro interno' });
    });

    it('should return 500 and error message: Unknown error', async () => {
      (
        pagamentoUseCase.buscarTransacaoPorPedidoId as jest.Mock
      ).mockRejectedValue('Erro interno');
      const request = { params: { pedidoId: 'IDPDO-123' } } as HttpRequest;
      const response: HttpResponse =
        await pagamentoController.buscarTransacaoPorPedidoId(request);

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Unknown error' });
    });
  });

  describe('gerarPagamento', () => {
    const pedido = { id: '123', total: 10 };

    it('should return qrCode and statusCode 201', async () => {
      (pagamentoUseCase.gerarPagamento as jest.Mock).mockResolvedValue({
        qrCode: 'qrCode',
      });

      const request = { body: { pedido } } as unknown as HttpRequest;
      const response: HttpResponse = await pagamentoController.gerarPagamento(
        request
      );

      expect(response.statusCode).toBe(201);
      expect(response.data).toEqual({ qrCode: 'qrCode' });
    });

    it('should return 500 if an error occurs', async () => {
      (pagamentoUseCase.gerarPagamento as jest.Mock).mockRejectedValue(
        new Error('Erro interno')
      );
      const request = { body: { pedido } } as unknown as HttpRequest;
      const response: HttpResponse = await pagamentoController.gerarPagamento(
        request
      );

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Erro interno' });
    });

    it('should return 500 and error message: Unknown error', async () => {
      (pagamentoUseCase.gerarPagamento as jest.Mock).mockRejectedValue(
        'Erro interno'
      );
      const request = { body: { pedido } } as unknown as HttpRequest;
      const response: HttpResponse = await pagamentoController.gerarPagamento(
        request
      );

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Unknown error' });
    });
  });

  describe('atualizarStatusPagamento', () => {
    it('should return 201 if statusPagamento is updated', async () => {
      (
        pagamentoUseCase.atualizarStatusPagamento as jest.Mock
      ).mockResolvedValue(undefined);

      const request = {
        body: { id: 'ID-123 ', status: 'paid' },
      } as unknown as HttpRequest;
      const response: HttpResponse =
        await pagamentoController.atualizarStatusPagamento(request);

      expect(response.statusCode).toBe(201);
      expect(response.data).toEqual({
        message: 'Status do pagamento atualizado com sucesso!',
      });
    });

    it('should return 500 if an error occurs', async () => {
      (
        pagamentoUseCase.atualizarStatusPagamento as jest.Mock
      ).mockRejectedValue(new Error('Erro interno'));
      const request = {
        body: { pagamentoStatus: 'Aprovado' },
        params: { id: '123' },
      } as unknown as HttpRequest;
      const response: HttpResponse =
        await pagamentoController.atualizarStatusPagamento(request);

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Erro interno' });
    });

    it('should return 500 and error message: Unknown error', async () => {
      (
        pagamentoUseCase.atualizarStatusPagamento as jest.Mock
      ).mockRejectedValue('Erro interno');
      const request = {
        body: { pagamentoStatus: 'Aprovado' },
        params: { id: '123' },
      } as unknown as HttpRequest;
      const response: HttpResponse =
        await pagamentoController.atualizarStatusPagamento(request);

      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Unknown error' });
    });
  });
});
