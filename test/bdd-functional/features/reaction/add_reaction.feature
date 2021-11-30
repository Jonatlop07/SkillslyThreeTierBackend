Feature: Add/remove reaction to post

  Scenario: A logged in user reacts to a post with a like
    Given a user exists
    And there exists a post identified by "1", and that belongs to user "2", with content:
      | description         | reference                                  | reference_type |
      | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |

    And the user provides the id of the post being "1" and the type of the reaction to add being "like"
    When the user tries to react to the post
    Then the reaction is added

  Scenario: A logged in user reacts to an unexisting post
    Given a user exists
    And the user provides the id of the post being "1" and the type of the reaction to add being "like"
    When the user tries to react to the post
    Then an error occurs: the post with the id provided does not exist
  
  Scenario: A logged in user reacts to a post that already has a reaction from the same user
    Given a user exists
    And there exists a post identified by "1", and that belongs to user "2", with content:
      | description         | reference                                  | reference_type |
      | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
    And there exists a reaction to the post identified by "1" from the user and the type of the reaction being "like"
    And the user provides the id of the post being "1" and the type of the reaction to add being "like"
    When the user tries to react to the post
    Then the reaction is removed 
  
  Scenario: A logged in user reacts to a post with an unvalid type of reaction 
    Given a user exists
    And there exists a post identified by "1", and that belongs to user "2", with content:
      | description         | reference                                  | reference_type |
      | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
    And the user provides the id of the post being "1" and the type of the reaction to add being "love"
    When the user tries to react to the post
    Then an error occurs: the type of the reaction does not match any of the available types 

