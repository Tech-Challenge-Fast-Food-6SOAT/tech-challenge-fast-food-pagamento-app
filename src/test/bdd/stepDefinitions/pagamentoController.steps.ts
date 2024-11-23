import { defineFeature, loadFeature } from 'jest-cucumber';

import { PagamentoController } from '@/adapters/controllers';
import type { PagamentoUseCase } from '@/application/usecases';
import type { HttpRequest, HttpResponse } from '@/interfaces/http';

const feature = loadFeature(
  './src/test/bdd/features/pagamentoController.feature'
);

defineFeature(feature, (test) => {
  const pagamentoUseCase = {
    buscarTransacaoPorPedidoId: jest.fn(),
  } as unknown as PagamentoUseCase;
  const pagamentoController = new PagamentoController(pagamentoUseCase);

  let response: HttpResponse = {} as HttpResponse;
  let request: HttpRequest = {} as HttpRequest;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Transacao is found', ({ given, when, then }) => {
    given(/^a transacao with pedidoId "(.*)" exists$/, (pedidoId: string) => {
      const transacao = {
        id: 'ID-123',
        pedidoId,
        valor: 100,
        pagamentoStatus: 'Aprovado',
        data: '2024-10-10T00:00:00.000Z',
        idTransacaoExterna: 'IDTE-123',
      };
      (
        pagamentoUseCase.buscarTransacaoPorPedidoId as jest.Mock
      ).mockResolvedValue(transacao);
      request = { params: { pedidoId } } as HttpRequest;
    });

    when('I call buscarTransacaoPorPedidoId', async () => {
      response = await pagamentoController.buscarTransacaoPorPedidoId(request);
    });

    then(/^the response status code should be "(.*)"$/, (status: string) => {
      expect(response.statusCode).toEqual(Number(status));
    });

    then(
      /^the response data should contain the transacao with pedidoId "(.*)"$/,
      (pedidoId: string) => {
        expect(response.data).toEqual({
          id: 'ID-123',
          pedidoId,
          valor: 100,
          pagamentoStatus: 'Aprovado',
          data: '2024-10-10T00:00:00.000Z',
          idTransacaoExterna: 'IDTE-123',
        });
      }
    );
  });

  test('Receive an error', ({ given, when, then }) => {
    given('an error occurs when fetching transacao', () => {
      (
        pagamentoUseCase.buscarTransacaoPorPedidoId as jest.Mock
      ).mockRejectedValue(new Error('Internal error'));
    });

    when('I call buscarTransacaoPorPedidoId', async () => {
      response = await pagamentoController.buscarTransacaoPorPedidoId({
        params: { pedidoId: 'IDPDO-123' },
      } as HttpRequest);
    });

    then(/^the response status code should be "(.*)"$/, (status: string) => {
      expect(response.statusCode).toEqual(Number(status));
    });

    then('I should receive an error message', () => {
      expect(response.data).toEqual({ err: 'Internal error' });
    });
  });
});
