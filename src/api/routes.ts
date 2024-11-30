/* eslint-disable @typescript-eslint/require-await */
import type { FastifyInstance } from 'fastify';

import { PagamentoController } from '../adapters/controllers';
import {
  PagamentoGateway,
  PedidoGateway,
  SecretsGateway,
  TransacaoGateway,
} from '../adapters/gateways';
import { PagamentoUseCase } from '../application/usecases';
import {
  PgPromiseConnectionAdapter,
  TransacaoDbConnection,
} from '../infra/database/postgreSQL';
import { MicrosservicoPedido } from '../infra/microsservico';
import { PlataformaPagamentoFake } from '../infra/pagamento/plataformaPagamentoFake';
import type { HttpRequest } from '../interfaces/http';

const apiRoutes = async (app: FastifyInstance): Promise<void> => {
  const connection = await PgPromiseConnectionAdapter.getInstance();
  const transacaoDbConnection = new TransacaoDbConnection(connection);
  const transacaoGateway = new TransacaoGateway(transacaoDbConnection);
  const plataformaPagamentoFake = new PlataformaPagamentoFake();
  const pagamentoGateway = new PagamentoGateway(plataformaPagamentoFake);
  const secretsGateway = new SecretsGateway();
  const microsservicoPedido = new MicrosservicoPedido(secretsGateway);
  const pedidoGateway = new PedidoGateway(microsservicoPedido);
  const pagamentoUseCase = new PagamentoUseCase(
    transacaoGateway,
    pagamentoGateway,
    pedidoGateway
  );
  const pagamentoController = new PagamentoController(pagamentoUseCase);

  app.get('/pagamento/transacao/:pedidoId', async (request, reply) => {
    const response = await pagamentoController.buscarTransacaoPorPedidoId(
      request as HttpRequest
    );
    return reply.status(response.statusCode).send(response.data);
  });

  app.post('/pagamento/gerar', async (request, reply) => {
    const response = await pagamentoController.gerarPagamento(
      request as HttpRequest
    );
    return reply.status(response.statusCode).send(response.data);
  });

  app.post('/pagamento/webhook', async (request, reply) => {
    const response = await pagamentoController.atualizarStatusPagamento(
      request as HttpRequest
    );
    return reply.status(response.statusCode).send(response.data);
  });
};

export default apiRoutes;
