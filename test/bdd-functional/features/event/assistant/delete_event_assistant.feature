Feature: Delete Event Assistant

  Scenario Outline: A logged in user delete his assistance to an event
    Given a user exists, is logged in, and has an id "<UserId>"
    And an event exists, and has an id "<EventId>"
    And an event assistant relationship exists between the user and the event
    When the user deletes his assistance to the event
    Then the event assistant is deleted

    Examples:
      | UserId | EventId |
      | 1      | 2       |