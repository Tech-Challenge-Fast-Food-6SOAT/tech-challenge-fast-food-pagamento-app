export interface Connection {
  query: (statement: string, params: unknown[]) => Promise<unknown>;
}
