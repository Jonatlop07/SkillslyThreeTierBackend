Feature: Delete group join request
  Scenario: A logged in user deletes an existing join request to a certain group
    Given a user exists
    And there exists a group identified by "1", owned by user with id "2", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |        
    And there already exists a join request to the group from the user
    When the user tries to delete the request to join the group
    Then the join request to the group is then cancelled
  
