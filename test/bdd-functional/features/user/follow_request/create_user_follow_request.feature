Feature: Create User Follow Request

  Scenario Outline: A logged in user request friendship to another existing user
    Given a user exists, is logged in, and has an id "<UserId>"
    And another user to follow exists, and has an id "<UserToFollowId>"
    When the user request to follow the desired user
    Then a user follow request is created

    Examples:
      | UserId | UserToFollowId |
      | 1      | 2              |

  Scenario Outline: A logged in user fails to request friendship to another existing user because there already exists a friedship request
    Given a user exists, is logged in, and has an id "<UserId>"
    And another user to follow exists, and has an id "<UserToFollowId>"
    And there already exists an friendship request between the users
    When the user request to follow the desired user
    Then an error occurs: a friendship request between the users already exists

    Examples:
      | UserId | UserToFollowId |
      | 1      | 2              |
