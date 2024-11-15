/* eslint-disable @typescript-eslint/require-await */
import type { FastifyInstance } from 'fastify';

import { PagamentoController } from '../adapters/controllers';
import { PagamentoGateway, TransacaoGateway } from '../adapters/gateways';
import { PagamentoUseCase } from '../application/usecases';
import { TransacaoDbConnection } from '../infra/database/mongodb/db-connections';
import { PlataformaPagamentoFake } from '../infra/pagamento/plataformaPagamentoFake';

const apiRoutes = async (app: FastifyInstance): Promise<void> => {
  const transacaoDbConnection = new TransacaoDbConnection();
  const transacaoGateway = new TransacaoGateway(transacaoDbConnection);
  const plataformaPagamentoFake = new PlataformaPagamentoFake();
  const pagamentoGateway = new PagamentoGateway(plataformaPagamentoFake);
  const pagamentoUseCase = new PagamentoUseCase(
    transacaoGateway,
    pagamentoGateway
  );
  const pagamentoController = new PagamentoController(pagamentoUseCase);

  app.get('/pagamento/transacao/:pedidoId', async (request, reply) => {
    const response = await pagamentoController.buscarTransacaoPorPedidoId(
      request
    );
    return reply.status(response.statusCode).send(response.data);
  });

  app.post('/pagamento', async (request, reply) => {
    const response = await pagamentoController.gerarPagamento(request);
    return reply.status(response.statusCode).send(response.data);
  });

  app.post('/pagamento/webhook', async (request, reply) => {
    const response = await pagamentoController.atualizarStatusPagamento(
      request
    );
    return reply.status(response.statusCode).send(response.data);
  });
};

export default apiRoutes;
