Feature: Get Event Collection Of Friends 

  Scenario Outline:  A user gets a collection of events of his friends
    Given a user exists, is logged in, and has an id "<UserId>"
    When the user tries to get events of his friends
    Then a collection of event is returned

    Examples: 
      | UserId | 
      | 1      |