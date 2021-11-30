Feature: Create a chat conversation

  Scenario Outline: A user tries to create a conversation with other user
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And the user identified by "<UserId>" wants to initiate a conversation with user "<PartnerId>"
    When the user tries to create a simple conversation
    Then the conversation with the other user is created successfully
    Examples:
      | UserId | PartnerId |
      | 1      | 2         |

  Scenario Outline: A user tries to create a conversation with multiple users
    Given these users exists:
      | email                  | password  | name | date_of_birth |
      | newuser_123@test.com   | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com  | Abc123_tr | John | 01/01/2000    |
      | newuser_12345@test.com | Abc123_tr | Mark | 01/01/2000    |
    And the user identified by "<UserId>" wants to initiate a conversation named "<ConversationName>" with the users:
      | user_id |
      | 2       |
      | 3       |
      | 4       |
    When the user tries to create a group conversation
    Then the group conversation is created successfully
    Examples:
      | UserId | ConversationName |
      | 1      | NewConversation  |

  Scenario Outline: A user tries to create a conversation but does not indicate other users
    Given these users exists:
      | email                | password  | name | date_of_birth |
      | newuser_123@test.com | Abc123_tr | Juan | 01/01/2000    |
    And the user identified by "<UserId>" wants to initiate a conversation named "<ConversationName>" with the users:
    When the user tries to create a group conversation
    Then an error occurs: the user did not indicate other participants in the conversation
    Examples:
      | UserId | ConversationName |
      | 1      | NewConversation  |
