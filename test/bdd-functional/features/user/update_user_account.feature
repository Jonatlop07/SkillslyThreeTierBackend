Feature: Update user account

  Scenario Outline: A logged in user tries to update their account with credentials or account data in a valid format
    Given a user exists, is logged in, and has an id of "<UserId>"
    And the user provides the data to be updated: "<Email>", "<Password>", "<Name>", "<DateOfBirth>"
    When the user tries to update their account
    Then the account data is successfully updated

    Examples:
      | UserId | Email                | Password  | Name | DateOfBirth |
      | 1      | newuser_123@test.com | Abc123_tr | Juan | 01/01/2000  |

  Scenario Outline: A logged in user attempts to update their account with credentials or data in an invalid format
    Given a user exists, is logged in, and has an id of "<UserId>"
    And the user provides the data to be updated : "<Email>", "<Password>", "<Name>", "<DateOfBirth>"
    And the data of the account to create: "<Name>", "<DateOfBirth>"
    When the user tries to update their account
    Then an error occurs: the credentials or data provided by the user are in an invalid format

    Examples:
      | UserId | Email                | Password  | Name | DateOfBirth |
      | 1      | newuser_123test.com  | Ab12_     | Juan | 01/01/2000  |
      | 1      | newuser_123test.com  | Abc123_tr | Juan | 01/01/2000  |
      | 1      | newuser_123@test.com | Abcdefghi | Juan | 01/01/2000  |
      | 1      | newuser_123@test.com | Abc123_tr | Juan | 01-01-2000  |
      | 1      | newuser_123@test.com | Abc123_tr |      | 01-01-2000  |
