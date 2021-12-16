Feature: Update group

  Scenario: A logged in user tries to update a group's information
    Given a user exists
    And there exists a group identified by "1", owned by user with id "1", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |        
    And the user provides the group identified by "1"
    And the user provides the new info of the group being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a group of developers      | Development    | https://pbs.twimg.com/media/D-jnKUPU4AE3hVR.jpg                      |        
    When the user tries to update the group info
    Then the group is then updated with the new info provided

  Scenario: A logged in user tries to update a group's information with empty values
    Given a user exists
    And there exists a group identified by "1", owned by user with id "1", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg | 
    And the user provides the group identified by "1"
    And the user provides the new info of the group being:
      | name       | description                        | category       | picture                                                              |
      |            |                                    | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |     
    When the user tries to update the group info
    Then an error occurs: the group information must have at least a name, a description and a category

  Scenario: A logged in user tries to update a group's information but is not an owner of the group
    Given a user exists
    And there exists a group identified by "1", owned by user with id "2", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg | 
    And the user provides the group identified by "1"
    And the user provides the new info of the group being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a group of developers      | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |     
    When the user tries to update the group info
    Then an error occurs: the user has to be an owner to update the group's information