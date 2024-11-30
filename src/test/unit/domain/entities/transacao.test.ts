import { Transacao } from '@/domain/entities';
import { PagamentoStatus } from '@/domain/value-objects';

describe('Transacao', () => {
  const pagamentoStatus = new PagamentoStatus('Pendente');

  const input = {
    id: 'ID-321',
    pedidoId: 'IDPDO-123',
    valor: 10,
    pagamentoStatus,
    data: new Date(),
    idTransacaoExterna: 'IDTE-123',
  };

  const transacao = new Transacao(
    input.id,
    input.pedidoId,
    input.valor,
    input.pagamentoStatus,
    input.data,
    input.idTransacaoExterna
  );

  it('should create a Transacao instance', () => {
    expect(transacao).toBeInstanceOf(Transacao);
  });

  it('should return the correct id', () => {
    expect(transacao.id).toBe(input.id);
  });

  it('should return the correct pedidoId', () => {
    expect(transacao.pedidoId).toBe(input.pedidoId);
  });

  it('should return the correct valor', () => {
    expect(transacao.valor).toEqual(input.valor);
  });

  it('should return the correct pagamentoStatus', () => {
    expect(transacao.pagamentoStatus).toBe(input.pagamentoStatus);
  });

  it('should return the correct data', () => {
    expect(transacao.data).toBe(input.data);
  });

  it('should return the correct idTransacaoExterna', () => {
    expect(transacao.idTransacaoExterna).toBe(input.idTransacaoExterna);
  });
});
