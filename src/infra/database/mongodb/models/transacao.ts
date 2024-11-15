import mongoose from 'mongoose';

import { mongoConnection } from '../index';

const Schema = new mongoose.Schema(
  {
    pedidoId: {
      type: String,
      required: true,
    },
    valor: {
      type: Number,
      required: true,
    },
    pagamentoStatus: {
      type: String,
      required: true,
    },
    idTransacaoExterna: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

Schema.index({ pedido: 1 });

export const TransacaoModel = mongoConnection.model('transacoes', Schema);
