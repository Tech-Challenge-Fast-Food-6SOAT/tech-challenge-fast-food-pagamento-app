Feature: BDD - PagamentoController: buscarTransacaoPorPedidoId

  Scenario: Transacao is found
    Given a transacao with pedidoId "123" exists
    When I call buscarTransacaoPorPedidoId
    Then the response status code should be "200"
    And the response data should contain the transacao with pedidoId "123"

  Scenario: Receive an error
    Given an error occurs when fetching transacao
    When I call buscarTransacaoPorPedidoId
    Then the response status code should be "500"
    And I should receive an error message
