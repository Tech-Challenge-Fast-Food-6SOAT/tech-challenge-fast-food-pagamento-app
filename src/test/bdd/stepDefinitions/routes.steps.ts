/* eslint-disable @typescript-eslint/init-declarations */
import type { FastifyInstance } from 'fastify';
import { defineFeature, loadFeature } from 'jest-cucumber';

import { PagamentoController } from '@/adapters/controllers';
import apiRoutes from '@/api/routes';
import type { Transacao } from '@/domain/entities';
import { PgPromiseConnectionAdapter } from '@/infra/database/postgreSQL';
import type { HttpRequest } from '@/interfaces/http';

const feature = loadFeature('./src/test/bdd/features/routes.feature');

const mockFastifyInstance = (): jest.Mocked<FastifyInstance> => {
  const fastifyInstance = {
    get: jest.fn(),
    post: jest.fn(),
  } as unknown as jest.Mocked<FastifyInstance>;

  return fastifyInstance;
};

jest.mock('@/infra/logs/logger', () => ({
  Logger: { info: jest.fn() },
}));

jest.mock('@/adapters/gateways/pedido');
jest.mock('@/adapters/gateways/pagamento');
jest.mock('@/adapters/gateways/transacao');
jest.mock('@/application/usecases');
jest.mock('@/infra/database/postgreSQL');

const mockConnection = {
  query: jest.fn(),
};

(PgPromiseConnectionAdapter.getInstance as jest.Mock).mockReturnValue({
  db: mockConnection,
});

jest
  .mock('@/adapters/controllers')
  .fn(jest.fn().mockResolvedValue({ statusCode: 200, data: [] }));
PagamentoController.prototype.buscarTransacaoPorPedidoId = jest.fn();
PagamentoController.prototype.gerarPagamento = jest.fn();
PagamentoController.prototype.atualizarStatusPagamento = jest.fn();

defineFeature(feature, (test) => {
  const fastifyInstance: jest.Mocked<FastifyInstance> = mockFastifyInstance();
  let mockRequest: HttpRequest;
  let mockReply: any;
  let mockResponse: { statusCode: number; data: Transacao };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {} as HttpRequest;
    mockReply = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  });

  test('Transacao is found', ({ given, when, then }) => {
    given(/^a transacao with pedidoId "(.*)" exists$/, (pedidoId: string) => {
      mockRequest = { params: { pedidoId } } as HttpRequest;
      mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown;
      mockResponse = {
        statusCode: 200,
        data: {
          id: 'ID-123',
          pedidoId,
          valor: 100,
          pagamentoStatus: 'Pendente',
          data: new Date(),
          idTransacaoExterna: 'IDTE-123',
        } as unknown as Transacao,
      };
      (
        PagamentoController.prototype.buscarTransacaoPorPedidoId as jest.Mock
      ).mockResolvedValue(mockResponse);
    });

    when('I call GET /pagamento/transacao/:pedidoId', async () => {
      await apiRoutes(fastifyInstance);
      const routeHandler = fastifyInstance.get.mock.calls[0][1];
      await routeHandler(mockRequest, mockReply);
    });

    then(/^the response status code should be "(.*)"$/, (status: string) => {
      expect(mockReply.status).toHaveBeenCalledWith(Number(status));
    });

    then(
      /^the response data should contain the transacao with pedidoId "(.*)"$/,
      (pedidoId: string) => {
        expect(mockReply.send).toHaveBeenCalledWith({
          id: mockResponse.data.id,
          pedidoId,
          valor: mockResponse.data.valor,
          pagamentoStatus: mockResponse.data.pagamentoStatus,
          data: mockResponse.data.data,
          idTransacaoExterna: mockResponse.data.idTransacaoExterna,
        });
      }
    );
  });
});
