Feature: Delete User Follow Request

  Scenario Outline: A user deletes an existing follow request or a follow relationship
    Given a user exists, is logged in, and has an id "<UserId>"
    And another user destiny exists, and has an id "<UserDestinyId>"
    And a follow request or a follow relationship exists between the users
    When the user tries to delete the "<Action>"
    Then the follow request is deleted or the user stop following the destiny user

    Examples: 
      | UserId | UserDestinyId | Action |
      | 1      | 2             | request |
