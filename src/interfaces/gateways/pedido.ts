export interface IPedidoGateway {
  atualizarStatusPagamento: ({
    id,
    pagamentoStatus,
  }: {
    id: string;
    pagamentoStatus: string;
  }) => Promise<{ message: string }>;
}
