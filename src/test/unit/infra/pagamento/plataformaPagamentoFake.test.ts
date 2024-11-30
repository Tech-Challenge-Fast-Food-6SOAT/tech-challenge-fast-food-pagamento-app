/* eslint-disable @typescript-eslint/init-declarations */
import { randomUUID } from 'crypto';
import QRCode from 'qrcode';

import type { Pedido } from '@/domain/entities';
import { PlataformaPagamentoFake } from '@/infra/pagamento/plataformaPagamentoFake';

jest.mock('qrcode');
jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

describe('PlataformaPagamentoFake', () => {
  let plataformaPagamentoFake: PlataformaPagamentoFake;

  beforeEach(() => {
    plataformaPagamentoFake = new PlataformaPagamentoFake();
  });

  describe('executarTransacao', () => {
    it('should process and return idTransacaoExterna and qrCode', async () => {
      const pedido = { id: 'IDPDO-123', valor: 10 } as unknown as Pedido;
      const qrCodeUrl = 'fake-qrcode-url';
      const idTransacaoExterna = 'fake-uuid';

      (QRCode.toDataURL as jest.Mock).mockResolvedValue(qrCodeUrl);
      (randomUUID as jest.Mock).mockReturnValue(idTransacaoExterna);

      const result = await plataformaPagamentoFake.executarTransacao(pedido);

      expect(result).toEqual({
        idTransacaoExterna,
        qrCode: qrCodeUrl,
      });
      expect(QRCode.toDataURL).toHaveBeenCalledWith(
        `https://pagamentofake.com.br/${pedido.id}`
      );
      expect(randomUUID).toHaveBeenCalled();
    });
  });

  describe('converterMensagemWebhook', () => {
    it('should convert webhook message with paid', () => {
      const mensagem = { id: 'IDTE-123', status: 'paid' };
      const result = plataformaPagamentoFake.converterMensagemWebhook(mensagem);
      expect(result).toEqual({
        idTransacaoExterna: mensagem.id,
        pagamentoStatus: 'Aprovado',
      });
    });

    it('should convert webhook message with refused', () => {
      const mensagem = { id: 'IDTE-123', status: 'refused' };
      const result = plataformaPagamentoFake.converterMensagemWebhook(mensagem);
      expect(result).toEqual({
        idTransacaoExterna: mensagem.id,
        pagamentoStatus: 'Recusado',
      });
    });

    it('should convert webhook message with waiting_payment', () => {
      const mensagem = { id: 'IDTE-123', status: 'waiting_payment' };
      const result = plataformaPagamentoFake.converterMensagemWebhook(mensagem);
      expect(result).toEqual({
        idTransacaoExterna: mensagem.id,
        pagamentoStatus: 'Pendente',
      });
    });
  });
});
