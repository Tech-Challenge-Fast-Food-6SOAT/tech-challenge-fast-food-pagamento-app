Feature: BDD - TransacaoGateway: buscarTransacaoPorPedidoId

  Scenario: Transacao is found
    Given a transacao with pedidoId "123" exists
    When I call buscarTransacaoPorPedidoId with pedidoId "123"
    Then the response data should contain the transacao with pedidoId "123"

  Scenario: Transacao is not found
    Given a transacao with pedidoId "123" does not exist
    When I call buscarTransacaoPorPedidoId with pedidoId "123"
    Then the response should be null
