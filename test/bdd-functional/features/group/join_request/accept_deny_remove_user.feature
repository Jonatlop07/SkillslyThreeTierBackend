Feature: Accept or deny join group request or relationship

  Scenario: A group owner or admin accepts an existing join group request
    Given a user exists
    And there exists a group identified by "1", owned by user with id "1", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |  
    And there exists a join request to the group with id "1" from the user identified by "2"
    When the user tries to update the join request or group user with action being "accept"
    Then the requesting user becomes part of the group

  Scenario: A group owner or admin rejects an existing join group request
    Given a user exists
    And there exists a group identified by "1", owned by user with id "1", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |
    And there exists a join request to the group with id "1" from the user identified by "2"
    When the user tries to update the join request or group user with action being "reject"
    Then the join request is removed

  Scenario: A group owner or admin removes an existing group user from a group
    Given a user exists
    And there exists a group identified by "1", owned by user with id "1", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |
    And a user identified by "2" is part of the group with id "1"
    When the user tries to update the join request or group user with action being "remove"
    Then the group user is removed from the group

  Scenario: A user tries to remove an existing group user from a group but is not an owner
    Given a user exists
    And there exists a group identified by "1", owned by user with id "2", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |    
    And a user identified by "3" is part of the group with id "1"
    When the user tries to update the join request or group user with action being "remove"
    Then an error occurs: the user must be an owner to remove others from the group