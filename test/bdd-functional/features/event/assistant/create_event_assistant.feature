Feature: Create Event Assistant

  Scenario Outline: A logged in user confirms assistance to an event
    Given a user exists, is logged in, and has an id "<UserId>"
    And an event exists, and has an id "<EventId>"
    When the user confirms assistance to the event
    Then an event assistant is created

    Examples:
      | UserId | EventId |
      | 1      | 2       |