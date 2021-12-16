Feature: Get join group requests 

  Scenario: A user gets the collection of join requests to a group
    Given a user exists
    And there exists a group identified by "1", owned by user with id "1", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |   
    And there exists a join request to the group with id "1" from the user identified by "2"
    When the user tries to get the join requests to the group
    Then the collection of join requests is returned 