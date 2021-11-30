Feature: Get chat conversation messages

  Scenario Outline: A user successfully get the messages of a conversation
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And a conversation named "<ConversationName>" exists and is identified by "<ConversationId>" with the users:
      | user_id |
      | 1       |
      | 2       |
      | 3       |
    And the user identified by "<UserId>" provides the conversation id: "<ConversationId>"
    When the user tries to get the messages of the conversation
    Then the messages of the conversation are successfully returned

    Examples:
      | UserId | ConversationId | ConversationName |
      | 1      | 1              | NewConversation  |

  Scenario Outline: A user tries to get the messages of a conversation that does not exist
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And the user identified by "<UserId>" provides the conversation id: "<ConversationId>"
    When the user tries to get the messages of the conversation
    Then an error occurs: the conversation does not exist

    Examples:
      | UserId | ConversationId |
      | 1      | 1              |

  Scenario Outline: A user tries to get the messages of a conversation where they does not belong
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And a conversation named "<ConversationName>" exists and is identified by "<ConversationId>" with the users:
      | user_id |
      | 2       |
      | 3       |
    And the user identified by "<UserId>" provides the conversation id: "<ConversationId>"
    When the user tries to get the messages of the conversation
    Then an error occurs: the user does not belong to the conversation
    Examples:
      | UserId | ConversationId | ConversationName |
      | 1      | 1              | NewConversation  |

