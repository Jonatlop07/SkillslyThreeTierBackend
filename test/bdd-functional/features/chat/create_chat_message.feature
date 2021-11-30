Feature: Create chat message

  Scenario Outline: A user creates a message in a conversation
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And a conversation named "<ConversationName>" exists and is identified by "<ConversationId>" with the users:
      | user_id |
      | 1       |
      | 2       |
    And the user identified by "<UserId>" provides the message "<Message>" to be attached to the conversation identified by "<ConversationId>"
    When the user tries to create the message
    Then the message is successfully created

    Examples:
      | UserId | Message     | ConversationId | ConversationName |
      | 1      | Hello World | 1              | NewConversation  |

  Scenario Outline: A user tries to create an empty message in a conversation
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And a conversation named "<ConversationName>" exists and is identified by "<ConversationId>" with the users:
      | user_id |
      | 1       |
      | 2       |
    And the user identified by "<UserId>" provides the message "<Message>" to be attached to the conversation identified by "<ConversationId>"
    When the user tries to create the message
    Then an error occurs: the message provided by the user is empty

    Examples:
      | UserId | Message | ConversationId | ConversationName |
      | 1      |         | 1              | NewConversation  |

  Scenario Outline: A user tries to create a message in a conversation that does not exist
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And the user identified by "<UserId>" provides the message "<Message>" to be attached to the conversation identified by "<ConversationId>"
    When the user tries to create the message
    Then an error occurs: the conversation does not exist

    Examples:
      | UserId | Message     | ConversationId | ConversationName |
      | 1      | Hello World | 1              | NewConversation  |

  Scenario Outline: A user tries to create a message in a conversation they does not belong to
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And a conversation named "<ConversationName>" exists and is identified by "<ConversationId>" with the users:
      | user_id |
      | 2       |
      | 3       |
    And the user identified by "<UserId>" provides the message "<Message>" to be attached to the conversation identified by "<ConversationId>"
    When the user tries to create the message
    Then an error occurs: the user does not belong to the conversation

    Examples:
      | UserId | Message     | ConversationId | ConversationName |
      | 1      | Hello World | 1              | NewConversation  |
