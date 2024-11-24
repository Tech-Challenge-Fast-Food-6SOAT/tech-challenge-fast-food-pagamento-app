/* eslint-disable @typescript-eslint/init-declarations */
import { defineFeature, loadFeature } from 'jest-cucumber';

import type {
  PagamentoGateway,
  PedidoGateway,
  TransacaoGateway,
} from '@/adapters/gateways';
import { PagamentoUseCase } from '@/application/usecases';
import type { Transacao } from '@/domain/entities';

const feature = loadFeature('./src/test/bdd/features/pagamentoUseCase.feature');

defineFeature(feature, (test) => {
  const transacaoGateway = {
    buscarTransacaoPorPedidoId: jest.fn(),
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

  let result: Transacao;
  let resultPromise: Promise<Transacao>;
  let pagamentoUseCaseInput: string;

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
        transacaoGateway.buscarTransacaoPorPedidoId as jest.Mock
      ).mockResolvedValue(transacao);
      pagamentoUseCaseInput = pedidoId;
    });

    when('I call buscarTransacaoPorPedidoId', async () => {
      result = await pagamentoUseCase.buscarTransacaoPorPedidoId(
        pagamentoUseCaseInput
      );
    });

    then(
      /^the response data should contain the transacao with pedidoId "(.*)"$/,
      (pedidoId: string) => {
        expect(result).toEqual({
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

  test('Transacao is not found', ({ given, when, then }) => {
    given(/^a transacao with pedidoId "(.*)" does not exist$/, () => {
      (
        transacaoGateway.buscarTransacaoPorPedidoId as jest.Mock
      ).mockReturnValue(null);
    });

    when('I call buscarTransacaoPorPedidoId', () => {
      resultPromise = pagamentoUseCase.buscarTransacaoPorPedidoId('IDPDO-123');
    });

    then(
      /^I should receive an error message "(.*)"$/,
      async (message: string) => {
        await expect(resultPromise).rejects.toThrow(message);
      }
    );
  });
});
