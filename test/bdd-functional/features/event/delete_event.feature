Feature: Delete Event

    Scenario Outline: A logged in user tries to delete his event
        Given a user exists, is logged in, and has an id "<UserId>"
        And there exists an event identified by "<EventId>"
        When the user tries to delete his event
        Then the event no longer exists

    Examples:
      | UserId | EventId |
      | 1      | 2       |
