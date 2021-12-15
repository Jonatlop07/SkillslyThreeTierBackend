Feature: Update the details of a Group Conversation

  Scenario Outline: A user successfully updates the details of a group conversation
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And a conversation named "<ConversationName>" exists and is identified by "<ConversationId>" with the users:
      | user_id |
      | 1       |
      | 2       |
    And the user identified by "<UserId>" provides the edited details of the conversation: "<ConversationNewName>"
    When the user tries to update the details of the conversation
    Then the details of the conversation are successfully updated
    Examples:
      | UserId | ConversationId | ConversationName | ConversationNewName |
      | 1      | 1              | NewConversation  | UpdatedConversation |

  Scenario Outline: A user tries to update the details of a group conversation but they are in an invalid format
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And a conversation named "<ConversationName>" exists and is identified by "<ConversationId>" with the users:
      | user_id |
      | 1       |
      | 2       |
    And the user identified by "<UserId>" provides the edited details of the conversation: "<ConversationNewName>"
    When the user tries to update the details of the conversation
    Then an error occurs: the edited details of the conversation are in an invalid format
    Examples:
      | UserId | ConversationId | ConversationName | ConversationNewName |
      | 1      | 1              | NewConversation  |                     |

  Scenario Outline: A user that does not belong to a group conversation tries to update its details
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
      | newuser_1235@test.com | Abc123_tr | Jake | 01/01/2000    |
    And a conversation named "<ConversationName>" exists and is identified by "<ConversationId>" with the users:
      | user_id |
      | 2       |
      | 3       |
    And the user identified by "<UserId>" provides the edited details of the conversation: "<ConversationNewName>"
    When the user tries to update the details of the conversation
    Then an error occurs: the user does not belong to the group conversation
    Examples:
      | UserId | ConversationId | ConversationName | ConversationNewName |
      | 1      | 1              | NewConversation  | UpdatedConversation |

  Scenario Outline: A user tries to update the details of a group conversation that does not exist
    Given these users exists:
      | email                | password  | name | date_of_birth |
      | newuser_123@test.com | Abc123_tr | Juan | 01/01/2000    |
    And the user provides the conversation id: "<ConversationId>"
    And the user identified by "<UserId>" provides the edited details of the conversation: "<ConversationNewName>"
    When the user tries to update the details of the conversation
    Then an error occurs: the group conversation does not exist
    Examples:
      | UserId | ConversationId | ConversationNewName |
      | 1      | 1              | UpdatedConversation |
