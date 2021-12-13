Feature: Create group join request
  Scenario: A logged in user requests to join a group
    Given a user exists
    And there exists a group identified by "1", owned by user with id "2", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |        
    And the user provides the group id being "1"
    When the user requests to join the group
    Then the join request is then created
  
  Scenario: A logged in user requests to join a group but they have already requested to join
    Given a user exists
    And there exists a group identified by "1", owned by user with id "2", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |        
    And the user provides the group id being "1"
    And there already exists a join request to the group from the user
    When the user requests to join the group
    Then an error occurs: a join request to the group already exists or the user already belongs to the group
