Feature: Leave group

  Scenario: A user leaves a group
    Given a user exists
    And there exists a group identified by "1", owned by user with id "2", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |
    And a user identified by "1" is part of the group with id "1"  
    And the user provides the group identified by "1"  
    When the user tries to leave the group
    Then the user is not part of the group anymore

  Scenario: A user tries to leave a group but its the only owner of the group
    Given a user exists
    And there exists a group identified by "1", owned by user with id "1", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg | 
    And the user provides the group identified by "1"  
    When the user tries to leave the group
    Then an error occurs: there must be more than one owner so the current owner can leave the group
