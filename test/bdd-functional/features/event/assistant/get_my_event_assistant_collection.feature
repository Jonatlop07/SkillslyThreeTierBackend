Feature: Get my event assitant Collection

  Scenario Outline: An assitant user gets a collection of events
    Given a user exists, is logged in, and has an id "<UserId>"
    When the assistant user tries to get his events
    Then a collection of events is returned
    Examples:
      | UserId |
      | 1      |
