Feature: Validate account credentials

  Scenario Outline: A user that has an account validates their credentials in successfully
    Given a user provides the credentials: "<UserEmail>" and "<UserPassword>"
    And an account exist with credentials: "<Email>" and "<Password>"
    When the user tries to validate their credentials
    Then the user gets the id of their account

    Examples:
      | UserEmail            | UserPassword | Email                | Password  |
      | newuser_123@test.com | Abc123_tr    | newuser_123@test.com | Abc123_tr |

  Scenario Outline: A user that has an account cannot validate their credentials due to invalid ones
    Given a user provides the credentials: "<UserEmail>" and "<UserPassword>"
    And an account exist with credentials: "<Email>" and "<Password>"
    When the user tries to validate their credentials
    Then an error occurs: the credentials provided by the user are not valid

    Examples:
      | UserEmail            | UserPassword | Email                | Password  |
      | newuser_123@test.com | Abc123_t     | newuser_123@test.com | Abc123_tr |

  Scenario Outline: A user tries to validate credentials of an account that does not exist
    Given a user provides the credentials: "<UserEmail>" and "<UserPassword>"
    When the user tries to validate their credentials
    Then an error occurs: the email provided by the user does not match an account

    Examples:
      | UserEmail            | UserPassword |
      | newuser_12@test.com  | Abc123_tr    |
