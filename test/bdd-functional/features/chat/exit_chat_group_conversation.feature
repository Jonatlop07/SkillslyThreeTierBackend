Feature: Exit a Group Conversation
  Scenario Outline: A user successfully exits a group conversation
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And a conversation named "<ConversationName>" exists and is identified by "<ConversationId>" with the users:
      | user_id |
      | 1       |
      | 2       |
    When the user identified by "<UserId>" tries to exit the conversation
    Then the user successfully exits the conversation
    Examples:
      | UserId | ConversationId | ConversationName |
      | 1      | 1              | NewConversation  |

  Scenario Outline: A user that does not belong to a group conversation tries to exit to it
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
      | newuser_1235@test.com | Abc123_tr | Jake | 01/01/2000    |
    And a conversation named "<ConversationName>" exists and is identified by "<ConversationId>" with the users:
      | user_id |
      | 2       |
      | 3       |
    When the user identified by "<UserId>" tries to exit the conversation
    Then an error occurs: the user does not belong to the group conversation
    Examples:
      | UserId | ConversationId | ConversationName |
      | 1      | 1              | NewConversation  |

  Scenario Outline: A user tries to exit a group conversation that does not exist
    Given these users exists:
      | email                | password  | name | date_of_birth |
      | newuser_123@test.com | Abc123_tr | Juan | 01/01/2000    |
    And the user provides the conversation id: "<ConversationId>"
    When the user identified by "<UserId>" tries to exit the conversation
    Then an error occurs: the group conversation does not exist
    Examples:
      | UserId | ConversationId |
      | 1      | 1              |
