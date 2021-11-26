Feature: Create User Follow Request

  Scenario Outline: A logged in user request frienship to another existing user
    Given a user exists, is logged in, and has an id "<UserId>"
    And another user destiny exists, and has an id "<UserDestinyId>"
    When the user request to follow the destiny user 
    Then a user follow request is created

    Examples: 
      | UserId | UserDestinyId |
      | 1      | 2             |