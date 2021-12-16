Feature: Delete group

  Scenario: A logged in user tries to delete a group they own 
    Given a user exists
    And there exists a group identified by "1", owned by user with id "1", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |        
    And the user provides the group identified by "1"
    When the user tries to delete the group
    Then the group is then deleted and returned to the user

  Scenario: A logged in user tries to delete a group they don't own
    Given a user exists
    And there exists a group identified by "1", owned by user with id "2", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |        
    And the user provides the group identified by "1"
    When the user tries to delete the group
    Then an error occurs: only the owners can delete the group