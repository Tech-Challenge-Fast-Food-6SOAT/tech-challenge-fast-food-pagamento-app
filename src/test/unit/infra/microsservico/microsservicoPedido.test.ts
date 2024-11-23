/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/init-declarations */
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';

import { SecretsGateway } from '@/adapters/gateways';
import { MicrosservicoPedido } from '@/infra/microsservico';

jest.mock('@/adapters/gateways/secrets');

describe('MicrosservicoPedido', () => {
  let mockAxios: AxiosMockAdapter;
  let secretsGateway: jest.Mocked<SecretsGateway>;
  let microsservicoPedido: MicrosservicoPedido;

  beforeEach(() => {
    mockAxios = new AxiosMockAdapter(axios);
    secretsGateway = new SecretsGateway() as jest.Mocked<SecretsGateway>;
    microsservicoPedido = new MicrosservicoPedido(secretsGateway);
    jest.clearAllMocks();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should make a produto update request successfully', async () => {
    const id = '123';
    const pagamentoStatus = 'Aprovado';
    const baseUrl = 'http://mocked-url.com';
    const produto = {
      nome: 'NomeProduto',
      preco: 10,
      descricao: 'DescricaoProduto',
    };
    const axiosResponse = { status: 'success', data: produto };
    (secretsGateway.getSecretValue as jest.Mock).mockResolvedValue(baseUrl);

    mockAxios
      .onPatch(`${baseUrl}/pedidos/pedido/${id}/status-pagamento`, {
        pagamentoStatus,
      })
      .reply(200, axiosResponse);

    const result = await microsservicoPedido.atualizarStatusPagamento({
      id,
      pagamentoStatus,
    });

    expect(result).toEqual(axiosResponse);
    expect(secretsGateway.getSecretValue).toHaveBeenCalledWith(
      'LANCHONETE_API'
    );
  });
});
