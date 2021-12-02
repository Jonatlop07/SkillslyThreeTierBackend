Feature: Get chat conversations

  Scenario Outline: A user get their conversations
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | Lucy | 01/01/2000    |
    And the user that tries to get their conversations is identified by "UserId"
    And simple conversations with these users exist:
      | user_id |
      | 2       |
      | 3       |
    And the group conversation exists with name "ConversationName" and among the users:
      | user_id |
      | 1       |
      | 2       |
      | 3       |
    When the user tries to get all their conversations
    Then the conversations are successfully returned

    Examples:
      | UserId | ConversationName |
      | 1      | Javalimos        |
