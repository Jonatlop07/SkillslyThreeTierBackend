Feature: Get My Event Collection 

  Scenario Outline:  A user gets a collection of his events 
    Given a user exists, is logged in, and has an id "<UserId>"
    When the user tries to get his events
    Then a collection of event is returned

    Examples: 
      | UserId | 
      | 1      |