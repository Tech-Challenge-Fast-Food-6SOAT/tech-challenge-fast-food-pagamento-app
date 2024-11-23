Feature: BDD - apiRoutes: /pagamento/transacao/:pedidoId

  Scenario: Transacao is found
    Given a transacao with pedidoId "123" exists
    When I call GET /pagamento/transacao/:pedidoId
    Then the response status code should be "200"
    And the response data should contain the transacao with pedidoId "123"
