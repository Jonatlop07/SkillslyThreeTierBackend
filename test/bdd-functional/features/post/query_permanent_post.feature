Feature: Query permanent posts

  Scenario: A logged in user tries to query a specific permanent post
    Given a user exists
    And there exists a post identified by "1", with privacy "public", and that belongs to user "1", with content:
      | description         | reference                                  | reference_type |
      | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |

    And the user provides the id of the post being "1" and the id of the owner user being "1"
    When the user tries to query the post
    Then the post is then returned
  
Scenario: A logged in user tries to query the collection of permanent posts that belong to himself
    Given a user exists
    And there exists a collection of posts that belongs to user "1"
    And the user provides the id of the owner being "1"
    When the user tries to query a collection of posts
    Then the collection of posts is then returned

  Scenario: A logged in user tries to query the collection of permanent posts that belong to another user who is friends with them
    Given a user exists
    And there exists a user with id being "2"
    And there exists a collection of posts that belongs to user "2"
    And there exists a following relationship between the two users 
    And the user provides the id of the owner being "2"
    When the user tries to query a collection of posts
    Then the collection of all posts is then returned

  Scenario: A logged in user tries to query the collection of permanent posts that belong to another user who is not friends with them
    Given a user exists
    And there exists a user with id being "2"
    And there exists a collection of posts that belongs to user "2"
    And the user provides the id of the owner being "2"
    When the user tries to query a collection of posts
    Then the collection of posts that are public is returned

  Scenario: A logged in user tries to query the collection of permanent posts that belong to another user that does not exist
    Given a user exists
    And the user provides the id of the owner being "2"
    When the user tries to query a collection of posts
    Then an error occurs: the user with the provided id does not exist

  Scenario: A logged in user tries to query a permanent post that does not exist
    Given a user exists
    And there exists a user with id being "2"
    And the user provides the id of the post being "1" and the id of the owner user being "2"
    When the user tries to query the post
    Then an error occurs: the post with the provided id does not exist

  Scenario: A logged in user tries to query a permanent post from a user that does not exist
    Given a user exists
    And the user provides the id of the post being "1" and the id of the owner user being "2"
    When the user tries to query the post
    Then an error occurs: the user with the provided id does not exist

  Scenario: A logged in user tries to query the collection of permanent posts from a specific group
    Given a user exists
    And there exists a group identified by "1", owned by user with id "2", with info being:
      | name       | description                        | category       | picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg | 
    And there exists a collection of posts that belongs to group identified by "1"
    And a user identified by "1" is part of the group with id "1"
    And the user provides the group identified by "1"
    When the user tries to query a collection of posts that belong to the group
    Then the collection of posts is then returned