import type { PagamentoUseCase } from '../../application/usecases';
import type { HttpRequest, HttpResponse } from '../../interfaces/http';

export class PagamentoController {
  public constructor(private readonly pagamentoUseCase: PagamentoUseCase) {}

  public async buscarTransacaoPorPedidoId(
    request: HttpRequest
  ): Promise<HttpResponse> {
    try {
      const { pedidoId } = request.params;
      const transacao = await this.pagamentoUseCase.buscarTransacaoPorPedidoId(
        pedidoId
      );

      return {
        data: {
          id: transacao.id,
          pedidoId: transacao.pedidoId,
          valor: transacao.valor,
          pagamentoStatus: transacao.pagamentoStatus,
          data: transacao.data,
          idTransacaoExterna: transacao.idTransacaoExterna,
        },
        statusCode: 200,
      };
    } catch (err: any) {
      return {
        data: {
          err: err?.message,
        },
        statusCode: 500,
      };
    }
  }

  public async gerarPagamento(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { pedido } = request.body;
      const data = await this.pagamentoUseCase.gerarPagamento(pedido);

      return {
        data,
        statusCode: 201,
      };
    } catch (err: any) {
      return {
        data: {
          err: err?.message,
        },
        statusCode: 500,
      };
    }
  }

  public async atualizarStatusPagamento(
    request: HttpRequest
  ): Promise<HttpResponse> {
    try {
      await this.pagamentoUseCase.atualizarStatusPagamento(request.body);

      return {
        data: {
          message: 'Status do pagamento atualizado com sucesso!',
        },
        statusCode: 201,
      };
    } catch (err: any) {
      return {
        data: {
          err: err?.message,
        },
        statusCode: 500,
      };
    }
  }
}
