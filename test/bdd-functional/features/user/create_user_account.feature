Feature: Create user account

  Scenario Outline: A user tries to create an account with credentials and account data in a valid format
    Given the user provides the credentials: "<Email>" and "<Password>"
    And the data of the account to create: "<Name>", "<DateOfBirth>"
    When the user tries to create an account
    Then an account is then created with user information and login credentials

    Examples:
      | Email                | Password  | Name | DateOfBirth |
      | newuser_123@test.com | Abc123_tr | Juan | 01/01/2000  |

  Scenario Outline: A user attempts to create an account with the credentials and data in an invalid format
    Given the user provides the credentials: "<Email>" and "<Password>"
    And the data of the account to create: "<Name>", "<DateOfBirth>"
    When the user tries to create an account
    Then an error occurs: the credentials and data provided by the user are in an invalid format

    Examples:
      | Email                | Password  | Name | DateOfBirth |
      | newuser_123test.com  | Ab12_     | Juan | 01/01/2000  |
      | newuser_123test.com  | Abc123_tr | Juan | 01/01/2000  |
      | newuser_123@test.com | Abcdefghi | Juan | 01/01/2000  |
      | newuser_123@test.com | Abc123_tr | Juan | 01-01-2000  |

  Scenario Outline: A user fails to create an account because there already exists an account with the email provided
    Given the user provides the credentials: "<Email>" and "<Password>"
    And the data of the account to create: "<Name>", "<DateOfBirth>"
    And there already exists an account identified by the email provided by the user
    When the user tries to create an account
    Then an error occurs: an account with the email provided by the user already exists

    Examples:
      | Email                | Password  | Name | DateOfBirth |
      | newuser_123@test.com | Bcd234_xy | Juan | 01/01/2000  |
