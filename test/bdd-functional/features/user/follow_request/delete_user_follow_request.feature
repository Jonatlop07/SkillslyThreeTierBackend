Feature: Delete User Follow Request

  Scenario Outline: A user deletes an existing follow request or a follow relationship
    Given a user exists, is logged in, and has an id "<UserId>"
    And another user to follow exists, and has an id "<UserToFollowId>"
    And a follow request or a follow relationship exists between the users
    When the user tries to delete the "<IsRequest>"
    Then the follow request is deleted or the user stop following the desired user

    Examples:
      | UserId | UserToFollowId | IsRequest |
      | 1      | 2              | true      |
