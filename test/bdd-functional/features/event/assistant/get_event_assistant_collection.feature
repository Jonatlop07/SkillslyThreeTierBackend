Feature: Get event assitant Collection

  Scenario Outline: An event gets a collection of existing assitants
    Given an event exists, and has an id "<EventId>"
    When the event tries to get his assitants
    Then a collection of assistants is returned
    Examples:
      | EventId |
      | 1       |
