Feature: Query group users 

  Scenario: A logged in user tries to query a groups users
    Given a user exists
    And there exists a group identified by "1", owned by user with id "1", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |   
    And a user identified by "2" is part of the group with id "1"
    And the user provides the group identified by "1"
    When the user tries to query the users of the group
    Then the users collection is then returned

  Scenario: A logged in user tries to query a groups users but the group does not exist
    Given a user exists
    And the user provides the group identified by "1"
    When the user tries to query the users of the group
    Then an error occurs: the group with the provided id does not exist