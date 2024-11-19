export interface DbConnection {
  buscarUm: <T = unknown>(params: Record<string, unknown>) => Promise<T | null>;
  criar: <T = unknown>(params: Record<string, unknown>) => Promise<T>;
  editar: <T = unknown>(params: {
    id: string;
    value: Record<string, unknown>;
  }) => Promise<T | null>;
}
