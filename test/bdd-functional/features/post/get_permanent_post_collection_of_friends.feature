Feature: Get permanent post collection of friends

  Scenario Outline: A user gets a collection of permanent post of his friends
    Given a user exists, is logged in, and has an id "<UserId>"
    When the user tries to get permanent posts of his friends
    Then a collection of permanent posts is returned

    Examples: 
      | UserId | 
      | 1      |