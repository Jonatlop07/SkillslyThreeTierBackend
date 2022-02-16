Feature: Delete an user temporal post

  Scenario: A logged user tries to delete a created temporal post
    Given an existing user
    And there exists a temporal post identified by "1", and belongs to that user:
      | description       | reference                                  | reference_type |
      | "Temporal Post 1" | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
    When user tries to delete the temporal post
    Then the temporal post is deleted successfully


  Scenario: A logged user tries to delete a temporal post that does not exist
    Given an existing user
    And user provides temporal post id "2"
    When user tries to delete the temporal post
    Then an error occurs: temporal post does not exist
