Feature: Delete user account

  Scenario Outline: A logged in user tries to delete their account
    Given a user exists, is logged in, and has an id of "<UserId>"
    When the user tries to delete their account
    Then the user account no longer exists

    Examples:
      | UserId |
      | 1      |
