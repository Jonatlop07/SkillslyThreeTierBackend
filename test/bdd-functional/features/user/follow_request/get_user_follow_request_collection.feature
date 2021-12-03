Feature: Get User Follow Request Collection

  Scenario Outline: A user gets a collection of existing follow requests or follow relationships
    Given a user exists, is logged in, and has an id "<UserId>"
    When the user tries to get his relationship with anothers users
    Then a collection of follow request and follow relationships is returned

    Examples: 
      | UserId | 
      | 1      |
