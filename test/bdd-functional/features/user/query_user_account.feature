Feature: Query user account

  Scenario Outline: A logged in user tries to query their account information
    Given a user exists, is logged in, and has an id of "<UserId>"
    When the user tries to query the account
    Then the information of their account is successfully retrieved

    Examples:
      | UserId |
      | 1      |
