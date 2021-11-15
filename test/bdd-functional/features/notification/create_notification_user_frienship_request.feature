Feature: create notification user friendship request

  Scenario Outline: A user sends a friend request on another existing user account and the other user receives a notification
    Given a user exists, is logged in, and has an id of "<UserId>"
    And an account exists with credentials: 
      | email                | password  | name | date_of_birth |
      | newuser_123@test.com | Abc123_tr | Juan | 01/01/2000    |
    
    When the user requests a friendship to the user account
    Then a notification is created and the user related to the account receives it 

    Examples:
      | UserId |
      | 1      |
