Feature: Add members to group conversation

  Scenario Outline: A user successfully adds members to a group conversation
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
      | newuser_1235@test.com | Abc123_tr | Jake | 01/01/2000    |
      | newuser_1236@test.com | Abc123_tr | Jane | 01/01/2000    |
    And a conversation named "<ConversationName>" exists and is identified by "<ConversationId>" with the users:
      | user_id |
      | 1       |
      | 2       |
    And the user identified by "<UserId>" provides the ids of the members to add to the conversation:
      | user_id |
      | 2       |
      | 3       |
      | 4       |
    When the user tries add the members to the conversation
    Then the following members, identified by these ids, are added:
      | user_id |
      | 3       |
      | 4       |
    Examples:
      | UserId | ConversationId | ConversationName |
      | 1      | 1              | NewConversation  |

  Scenario Outline: A user that does not belong to a group conversation tries to add members to it
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
      | newuser_1235@test.com | Abc123_tr | Jake | 01/01/2000    |
      | newuser_1236@test.com | Abc123_tr | Jane | 01/01/2000    |
    And a conversation named "<ConversationName>" exists and is identified by "<ConversationId>" with the users:
      | user_id |
      | 2       |
      | 3       |
    And the user identified by "<UserId>" provides the ids of the members to add to the conversation:
      | user_id |
      | 4       |
    When the user tries add the members to the conversation
    Then an error occurs: the user does not belong to the conversation
    Examples:
      | UserId | ConversationId | ConversationName |
      | 1      | 1              | NewConversation  |

  Scenario Outline: A user tries to add members to a conversation that does not exist
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
      | newuser_1235@test.com | Abc123_tr | Jake | 01/01/2000    |
    And the user provides the conversation id: "<ConversationId>"
    And the user identified by "<UserId>" provides the ids of the members to add to the conversation:
      | user_id |
      | 2       |
      | 3       |
    When the user tries add the members to the conversation
    Then an error occurs: the conversation does not exist
    Examples:
      | UserId | ConversationId |
      | 1      | 1              |

  Scenario Outline: A user tries to add members to a conversation but is not an administrator
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
      | newuser_1235@test.com | Abc123_tr | Jake | 01/01/2000    |
      | newuser_1236@test.com | Abc123_tr | Jane | 01/01/2000    |
    And a conversation named "<ConversationName>" exists and is identified by "<ConversationId>" with the users:
      | user_id |
      | 1       |
      | 2       |
      | 3       |
    And the user identified by "<UserId>" provides the ids of the members to add to the conversation:
      | user_id |
      | 4       |
    When the user tries add the members to the conversation
    Then an error occurs: the user is not an administrator of the conversation
    Examples:
      | UserId | ConversationId | ConversationName |
      | 2      | 1              | NewConversation  |
