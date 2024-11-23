/* eslint-disable @typescript-eslint/unbound-method */
import type { FastifyInstance } from 'fastify/types/instance';

import { PagamentoController } from '@/adapters/controllers';
import apiRoutes from '@/api/routes';
import { PgPromiseConnectionAdapter } from '@/infra/database/postgreSQL';
import type { HttpRequest } from '@/interfaces/http';

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

describe('apiRoutes', () => {
  const fastifyInstance: jest.Mocked<FastifyInstance> = mockFastifyInstance();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register routes correctly', async () => {
    await apiRoutes(fastifyInstance);

    expect(fastifyInstance.get).toHaveBeenCalledWith(
      '/pagamento/transacao/:pedidoId',
      expect.any(Function)
    );
    expect(fastifyInstance.post).toHaveBeenCalledWith(
      '/pagamento/gerar',
      expect.any(Function)
    );
    expect(fastifyInstance.post).toHaveBeenCalledWith(
      '/pagamento/webhook',
      expect.any(Function)
    );
  });

  it('should call buscarTransacaoPorPedidoId on GET /pagamento/transacao/:pedidoId', async () => {
    const mockRequest = { params: { pedidoId: 'IDPDO-123' } } as HttpRequest;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: [] };

    (
      PagamentoController.prototype.buscarTransacaoPorPedidoId as jest.Mock
    ).mockResolvedValue(mockResponse);

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.get.mock.calls[0][1];
    await routeHandler(mockRequest, mockReply);

    expect(
      PagamentoController.prototype.buscarTransacaoPorPedidoId
    ).toHaveBeenCalledWith(mockRequest);
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  });

  it('should call gerarPagamento on POST /pagamento/gerar', async () => {
    const mockRequest = {
      body: {
        pedido: { id: 'IDPDO-123', total: 10 },
      } as unknown as HttpRequest,
    } as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 201, data: [] };

    (
      PagamentoController.prototype.gerarPagamento as jest.Mock
    ).mockResolvedValue(mockResponse);

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.post.mock.calls[0][1];
    await routeHandler(mockRequest, mockReply);

    expect(PagamentoController.prototype.gerarPagamento).toHaveBeenCalledWith(
      mockRequest
    );
    expect(mockReply.status).toHaveBeenCalledWith(201);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  });

  it('should call atualizarStatusPagamento on POST /pagamento/webhook', async () => {
    const mockRequest = {
      body: { id: 'IDTE-123', status: 'paid' },
    } as HttpRequest;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 201, data: [] };

    (
      PagamentoController.prototype.atualizarStatusPagamento as jest.Mock
    ).mockResolvedValue(mockResponse);

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.post.mock.calls[1][1];
    await routeHandler(mockRequest, mockReply);

    expect(
      PagamentoController.prototype.atualizarStatusPagamento
    ).toHaveBeenCalledWith(mockRequest);
    expect(mockReply.status).toHaveBeenCalledWith(201);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  });
});
