Feature: Query specific group or group collections by name, category or user groups 

  Scenario Outline: A logged in user tries to query the groups they belong to
    Given a user exists   
    And the user provides the search parameters being "<UserId>", "<Name>" or "<Category>"
    When the user tries to get the collection of groups according to the search
    Then the collection of groups they belong to is then returned
    Examples: 
      | UserId | Name | Category |
      | 1      |      |          |

  Scenario Outline: A logged in user tries to query a collection of groups by name
    Given a user exists
    And there exists a collection of groups
    And the user provides the search parameters being "<UserId>", "<Name>" or "<Category>"
    When the user tries to get the collection of groups according to the search
    Then the collection of groups that match the searched name is returned
    Examples: 
      | UserId | Name      | Category |
      |        | TechStuff |          |

  Scenario Outline: A logged in user tries to query a collection of groups by category
    Given a user exists
    And there exists a collection of groups
    And the user provides the search parameters being "<UserId>", "<Name>" or "<Category>"
    When the user tries to get the collection of groups according to the search
    Then the collection of groups that match the searched category is returned
    Examples: 
      | UserId | Name      | Category    |
      |        |           | Development |

  Scenario Outline: A logged in user tries to query a specific group
    Given a user exists
    And there exists a group identified by "1", owned by user with id "<OwnerId>", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |   
    And the user provides the group identified by "1" and the users id being "1" 
    When the user tries query the specific group
    Then the group is then returned
    Examples: 
      | OwnerId |
      | 1       |
      | 2       |

  Scenario: A logged in user tries to query a group that does not exist
    Given a user exists
    And the user provides the group identified by "1" and the users id being "1"
    When the user tries query the specific group
    Then an error occurs: the group with the provided id does not exist