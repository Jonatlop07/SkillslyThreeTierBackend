Feature: Get an user profile

  Scenario: An user tries to get an user profile
    Given an existing user
    And there exists a profile belongs to that user, with content:
      | resume                      | knowledge    | talents     | activities              | interests     |
      | This is my profile, welcome | Maths,Python | Music,Piano | Polo,Tennis,Programming | GraphQL,ML,IA |
    When user tries to get user profile
    Then the user profile is obtained


  Scenario: An user tries to get an user profile that doesn't exist
    Given an existing user
    When user tries to get user profile
    Then an error occurs: there's no profile associated to the user

