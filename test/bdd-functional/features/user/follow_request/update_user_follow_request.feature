Feature: Update User Follow Request

  Scenario Outline: A user accepts an existing follow request
    Given a user exists, is logged in, and has an id "<UserId>"
    And another user to follow exists, and has an id "<UserToFollowId>"
    And a follow request exists between the users
    When the user to follow "<Accept>" the follow request
    Then the follow request is updated and the user follow the desired user

    Examples:
      | UserId | UserToFollowId | Accept |
      | 1      | 2              | true   |

  Scenario Outline: A user rejects an existing follow request
    Given a user exists, is logged in, and has an id "<UserId>"
    And another user to follow exists, and has an id "<UserToFollowId>"
    And a follow request exists between the users
    When the user to follow "<Accept>" the follow request
    Then the follow request is updated and the user do not follow the desired user

    Examples:
      | UserId | UserToFollowId | Accept |
      | 1      | 2              | false  |
