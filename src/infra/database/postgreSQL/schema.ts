export const createTransacoesSchemaSQL = `
    CREATE SCHEMA IF NOT EXISTS lanchonete;

    CREATE TABLE IF NOT EXISTS lanchonete.transacoes (
      id SERIAL PRIMARY KEY,
      pedido_id VARCHAR(255) NOT NULL,
      valor NUMERIC(10, 2) NOT NULL,
      pagamento_status VARCHAR(255) NOT NULL,
      id_transacao_externa VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_pedido_id ON lanchonete.transacoes (pedido_id);
  `;
