Feature: Create user account

  Scenario Outline: A user tries to create an account with credentials and account data in a valid format
    Given the user provides the credentials: email being "<Email>" and password being "<Password>"
    When the user tries to create an account
    Then an account is then created with user information and login credentials

    Examples:
      | Email                | Password  |
      | newuser_123@test.com | Abc123_tr |

  Scenario Outline: A user attempts to create an account with the credentials and data in an invalid format
    Given the user provides the credentials: email being "<Email>" and password being "<Password>"
    When the user tries to create an account
    Then an error occurs: the credentials provided by the user are in an invalid format

    Examples:
      | Email                | Password  |
      | newuser_123test.com  | Ab12_     |
      | newuser_123test.com  | Abc123_tr |
      | newuser_123@test.com | Abcdefghi |

  Scenario Outline: A user fails to create an account because there already exists an account with the email provided
    Given there already exists an account identified by the email "<Email>" and the user provides the email with the password "<Password>"
    When the user tries to create an account
    Then an error occurs: an account with the email provided by the user already exists

    Examples:
      | Email                | Password  |
      | newuser_123@test.com | Bcd234_xy |
