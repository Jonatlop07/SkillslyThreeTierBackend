Feature: Query post reactions

  Scenario: A logged in user tries to query the reactions from a post
    Given a user exists
    And there exists a post identified by "1", and that belongs to user "2", with content:
      | description         | reference                                  | reference_type |
      | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
    
    And there exists a set of reactions to the post identified by "1"
    And the user provides the id of the post being "1" 
    When the user tries to query the reactions from the post
    Then the reactions are returned separated by types

  Scenario: A logged in user tries to query the reactions from an unexisting post
    Given a user exists
    And the user provides the id of the post being "1" 
    When the user tries to query the reactions from the post
    Then an error occurs: the post with the id provided does not exist hence the user can't get the reactions
  
