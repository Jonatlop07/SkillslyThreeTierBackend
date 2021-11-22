Feature: Create a chat conversation

  Scenario Outline: A user tries to create a conversation with other user
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And the user identified by "<UserId>" wants to initiate a conversation with user "<PartnerId>"
    When the user tries to create a conversation
    Then the conversation of user "<UserId>" with user "<PartnerId>" is created
    Examples:
      | UserId | PartnerId |
      | 1      | 2         |

  Scenario Outline: A user tries to create a conversation with multiple users
    Given these users exists:
      | email                  | password  | name | date_of_birth |
      | newuser_123@test.com   | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com  | Abc123_tr | John | 01/01/2000    |
      | newuser_12345@test.com | Abc123_tr | Mark | 01/01/2000    |
    And the user identified by "<UserId>" wants to initiate a conversation with users:
      | 2 | 3 |
    When the user tries to create a conversation
    Then the conversation of user "<UserId>" with these users is created:
      | 2 | 3 |
    Examples:
      | UserId |
      | 1      |

  Scenario: A user tries to create a conversation but does not indicate other users
    Given these users exists:
      | email                | password  | name | date_of_birth |
      | newuser_123@test.com | Abc123_tr | Juan | 01/01/2000    |
    And the user identified by "<UserId>" wants to initiate a conversation with users:
      |  |
    When the user tries to create a conversation
    Then an error occurs: the user did not indicate other participants in the conversation
