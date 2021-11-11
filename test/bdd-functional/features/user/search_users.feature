Feature: Search Users

    Scenario Outline: A user searches for another user based on one or more data of the account or the profile information
        Given a user provides the parameters: "<UserEmail>" or "<UserName>"
        And accounts exists with parameters: 
        | email                | password  | name | date_of_birth |
        | newuser_123@test.com | Abc123_tr | Juan | 01/01/2000  |
        | juanRjx_123@test.com | Abc123_tr | Juan | 01/01/2000  |
        | user_123456@test.com | Abc123_tr | Lore | 01/01/2000  |

        When the user tries to search for an user
        Then the users associated with the parameters entered are returned

        Examples: 
        | UserEmail                | UserName |
        | newuser_123@test.com     | Juan |