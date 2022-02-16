Feature: Query temporal posts

  Scenario: A logged user tries to query a specific temporal post
    Given an existing user
    And there exists a temporal post identified by "1", and that belongs to user "1", with content:
      | description       | reference                                  | reference_type |
      | "Temporal Post 1" | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
    And user provides temporal post id being "1" and owner user id being "1"
    When user tries to query temporal post
    Then temporal post is returned


  Scenario: A logged user tries to query a collection of temporal posts
    Given an existing user
    And there exists a user with id being "2"
    And there exists a collection of posts that belongs to user with id "2"
    When user tries to query a collection of temporal posts
    Then the collection of temporal posts is returned


  Scenario: A logged user tries to query a temporal post that does not exist
    Given an existing user
    And there exists a user with id being "2"
    And user provides owner user id being "2" and temporal post id being "1"
    When user tries to query temporal post
    Then an error occurs: temporal post with provided id does not exist





