/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/unbound-method */
import { PagamentoGateway } from '@/adapters/gateways';
import type { PagamentoStatusEnum } from '@/domain/value-objects';
import { PagamentoStatus } from '@/domain/value-objects';
import { PlataformaPagamentoFake } from '@/infra/pagamento/plataformaPagamentoFake';

jest.mock('@/infra/pagamento/plataformaPagamentoFake');

describe('PagamentoGateway', () => {
  let pagamentoGateway: PagamentoGateway;
  let plataformaPagamentoFake: PlataformaPagamentoFake;

  beforeEach(() => {
    plataformaPagamentoFake = new PlataformaPagamentoFake();
    pagamentoGateway = new PagamentoGateway(plataformaPagamentoFake);
  });

  describe('gerarPagamento', () => {
    it('Should return a qrcode', async () => {
      const pedido = { id: 'IDPDO-123', total: 10 };
      const executarTransacaoOutput = {
        idTransacaoExterna: 'IDTE-123',
        qrCode: 'fake-qrcode-url',
      };
      jest
        .spyOn(plataformaPagamentoFake, 'executarTransacao')
        .mockResolvedValue(executarTransacaoOutput);

      const resultado = await pagamentoGateway.gerarPagamento(pedido);

      expect(resultado).toEqual(executarTransacaoOutput);
      expect(plataformaPagamentoFake.executarTransacao).toHaveBeenCalledWith(
        pedido
      );
    });
  });

  describe('converterMensagemWebhook', () => {
    it('Should return a converted message', () => {
      const mensagem = { id: 'IDTE-123', status: 'paid' };
      const converterMensagemWebhookOutput = {
        idTransacaoExterna: 'IDTE-123',
        pagamentoStatus: 'Aprovado',
      };
      jest
        .spyOn(plataformaPagamentoFake, 'converterMensagemWebhook')
        .mockReturnValue(converterMensagemWebhookOutput);

      const resultado = pagamentoGateway.converterMensagemWebhook(mensagem);

      expect(resultado).toEqual({
        idTransacaoExterna: converterMensagemWebhookOutput.idTransacaoExterna,
        pagamentoStatus: new PagamentoStatus(
          converterMensagemWebhookOutput.pagamentoStatus as PagamentoStatusEnum
        ),
      });
      expect(
        plataformaPagamentoFake.converterMensagemWebhook
      ).toHaveBeenCalledWith(mensagem);
    });
  });
});
