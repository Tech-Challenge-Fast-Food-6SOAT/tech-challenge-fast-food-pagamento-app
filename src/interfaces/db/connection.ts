export interface DbConnection {
  buscar: <T = unknown>(params: object) => Promise<T[]>;
  buscarUm: <T = unknown>(params: object) => Promise<T | null>;
  criar: <T = unknown>(params: object) => Promise<T>;
  excluir: (id: string) => Promise<void>;
  editar: <T = unknown>(params: {
    id: string;
    value: object;
  }) => Promise<T | null>;
}
