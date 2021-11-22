Feature: Create chat message

  Scenario Outline: A user creates a message in a conversation
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And a conversation exists and is identified by "<ConversationId>"
    And the user provides the message "<Message>" to be attached to the conversation identified by "<ConversationId>"
    When the user tries to create the message
    Then the message is successfully created

    Examples:
      | Message     | ConversationId |
      | Hello World | 1              |

  Scenario Outline: A user tries to create an empty message to a conversation
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And a conversation exists and is identified by "<ConversationId>"
    And the user provides the message "<Message>" to be attached to the conversation identified by "<ConversationId>"
    When the user tries to create the message
    Then an error occurs: the message provided by the user is empty

    Examples:
      | Message | ConversationId |
      |         | 1              |

  Scenario Outline: A user tries to create a message in a conversation that does not exist
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And the user provides the message "<Message>" to be attached to the conversation identified by "<ConversationId>"
    When the user tries to create the message
    Then an error occurs: the conversation does not exist
      | Message     | ConversationId |
      | Hello World | 1              |
