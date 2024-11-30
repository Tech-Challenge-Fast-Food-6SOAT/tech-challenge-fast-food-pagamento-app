/* eslint-disable @typescript-eslint/init-declarations */
import { defineFeature, loadFeature } from 'jest-cucumber';

import { TransacaoGateway } from '@/adapters/gateways';
import { Transacao } from '@/domain/entities';
import type { TransacaoDB } from '@/interfaces/db';
import type { DbConnection } from '@/interfaces/db/connection';

const feature = loadFeature('./src/test/bdd/features/transacaoGateway.feature');

defineFeature(feature, (test) => {
  const dbConnection = {
    buscarUm: jest.fn(),
  } as unknown as DbConnection;
  const transacaoGateway = new TransacaoGateway(dbConnection);

  let result: Transacao | null;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Transacao is found', ({ given, when, then }) => {
    const transacao = {
      id: 'ID-123',
      pedido_id: '',
      valor: 10,
      pagamento_status: 'Pendente',
      id_transacao_externa: 'IDTE-123',
      created_at: new Date(),
    } as unknown as TransacaoDB;

    given(/^a transacao with pedidoId "(.*)" exists$/, (pedidoId: string) => {
      transacao.pedido_id = pedidoId;
      (dbConnection.buscarUm as jest.Mock).mockResolvedValue(transacao);
    });

    when(
      /^I call buscarTransacaoPorPedidoId with pedidoId "(.*)"$/,
      async (pedidoId: string) => {
        result = await transacaoGateway.buscarTransacaoPorPedidoId(pedidoId);
      }
    );

    then(
      /^the response data should contain the transacao with pedidoId "(.*)"$/,
      (pedidoId: string) => {
        const expectedProduto = new Transacao(
          transacao.id,
          pedidoId,
          transacao.valor,
          transacao.pagamento_status,
          transacao.created_at,
          transacao.id_transacao_externa
        );
        expect(result).toEqual(expectedProduto);
        expect(dbConnection.buscarUm).toHaveBeenCalledWith({
          pedido_id: pedidoId,
        });
      }
    );
  });

  test('Transacao is not found', ({ given, when, then }) => {
    given(/^a transacao with pedidoId "(.*)" does not exist$/, () => {
      (dbConnection.buscarUm as jest.Mock).mockResolvedValue(null);
    });

    when(
      /^I call buscarTransacaoPorPedidoId with pedidoId "(.*)"$/,
      async (pedidoId: string) => {
        result = await transacaoGateway.buscarTransacaoPorPedidoId(pedidoId);
      }
    );

    then(/^the response should be null$/, () => {
      expect(result).toBeNull();
    });
  });
});
