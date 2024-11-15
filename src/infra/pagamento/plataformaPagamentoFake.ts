import { randomUUID } from 'crypto';
import QRCode from 'qrcode';

import type { Pedido } from '../../domain/entities';
import type { IPlataformaPagamento } from '../../interfaces/plataformaPagamento';

export class PlataformaPagamentoFake implements IPlataformaPagamento {
  public async executarTransacao(
    pedido: Pedido
  ): Promise<{ idTransacaoExterna: string; qrCode: string }> {
    const qrCode = await QRCode.toDataURL(
      `https://pagamentofake.com.br/${pedido.id}`
    );
    return { idTransacaoExterna: randomUUID(), qrCode };
  }

  public converterMensagemWebhook(mensagem: { id: string; status: string }): {
    idTransacaoExterna: string;
    pagamentoStatus: string;
  } {
    const STATUS: Record<string, string> = {
      paid: 'Aprovado',
      refused: 'Recusado',
      waiting_payment: 'Pendente',
    };
    return {
      idTransacaoExterna: mensagem.id,
      pagamentoStatus: STATUS[mensagem.status],
    };
  }
}
