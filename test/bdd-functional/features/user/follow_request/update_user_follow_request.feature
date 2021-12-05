Feature: Update User Follow Request

  Scenario Outline: A user accepts an existing follow request
    Given a user exists, is logged in, and has an id "<UserId>"
    And another user destiny exists, and has an id "<UserDestinyId>"
    And a follow request exists between the users
    When the user destiny "<Accept>" the follow request
    Then the follow request is updated and the user follow the destiny user

    Examples: 
      | UserId | UserDestinyId | Accept |
      | 1      | 2             | true   |

  Scenario Outline: A user rejects an existing follow request
    Given a user exists, is logged in, and has an id "<UserId>"
    And another user destiny exists, and has an id "<UserDestinyId>"
    And a follow request exists between the users
    When the user destiny "<Action>" the follow request
    Then the follow request is updated and the user do not follow the destiny user

    Examples: 
      | UserId | UserDestinyId | Accept |
      | 1      | 2             | false  |
