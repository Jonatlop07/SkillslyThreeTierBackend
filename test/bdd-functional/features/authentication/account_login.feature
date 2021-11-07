Feature: Account log in

  Scenario: A user that has an account logs in successfully
    Given a user provides the credentials: "<UserEmail>" and "<UserPassword>"
    And an account exist with credentials: "<Email>" and "<Password>"
    When the user tries to log into the account
    Then the user receives a token that autenticates them

  Scenario: A user has an account and tries to log in with invalid credentials
    Given a user provides the credentials: "<UserEmail>" and "<UserPassword>"
    And an account exist with credentials: "<Email>" and "<Password>"
    When the user tries to log into the account
    Then an error occurs: the credentials provided by the user are not valid

  Scenario: A user tries log in to an account that does not exist
    Given a user provides the credentials: "<Email>" and "<Password>"
    When the user tries to log into the account
    Then an error occurs: the email provided by the user does not match an account
