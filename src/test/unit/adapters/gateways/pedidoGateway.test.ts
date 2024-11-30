import { PedidoGateway } from '@/adapters/gateways';
import type { Pedido } from '@/domain/entities';
import type { IMicrosservicoPedido } from '@/interfaces/microsservico';

describe('PedidoGateway', () => {
  const microsservicoPedido = {
    atualizarStatusPagamento: jest.fn(),
  } as unknown as IMicrosservicoPedido;
  const pagamentoGateway = new PedidoGateway(microsservicoPedido);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('atualizarStatusPagamento', () => {
    it('should return updated pedido', async () => {
      const pedido = {
        id: '123',
        produtos: [
          {
            produto: {
              nome: 'NomeProduto',
              preco: 10,
              descricao: 'Descrição do Produto',
            },
            quantidade: 1,
          },
        ],
        total: 10,
        status: 'Recebido',
        pagamentoStatus: 'Aprovado',
        senha: '0001',
      } as unknown as Pedido;
      (
        microsservicoPedido.atualizarStatusPagamento as jest.Mock
      ).mockResolvedValue(pedido);
      const result = await pagamentoGateway.atualizarStatusPagamento({
        id: '123',
        pagamentoStatus: 'Aprovado',
      });
      expect(result).toEqual(pedido);
      expect(microsservicoPedido.atualizarStatusPagamento).toHaveBeenCalledWith(
        { id: '123', pagamentoStatus: 'Aprovado' }
      );
      expect(
        microsservicoPedido.atualizarStatusPagamento
      ).toHaveBeenCalledTimes(1);
    });
  });
});
