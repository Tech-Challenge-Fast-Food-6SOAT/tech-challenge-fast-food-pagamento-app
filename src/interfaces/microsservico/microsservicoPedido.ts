export interface IMicrosservicoPedido {
  atualizarStatusPagamento: ({
    id,
    pagamentoStatus,
  }: {
    id: string;
    pagamentoStatus: string;
  }) => Promise<{ message: string }>;
}
