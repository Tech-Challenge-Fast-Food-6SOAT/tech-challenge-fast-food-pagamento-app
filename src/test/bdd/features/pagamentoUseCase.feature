Feature: BDD - PagamentoUseCase: buscarTransacaoPorPedidoId

  Scenario: Transacao is found
    Given a transacao with pedidoId "123" exists
    When I call buscarTransacaoPorPedidoId
    Then the response data should contain the transacao with pedidoId "123"

  Scenario: Transacao is not found
    Given a transacao with pedidoId "123" does not exist
    When I call buscarTransacaoPorPedidoId
    Then I should receive an error message "Transação não encontrada"
