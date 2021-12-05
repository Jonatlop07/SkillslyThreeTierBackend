Feature: Update permanent post

  Scenario: A logged in user tries to update a permanent post with multimedia content and descriptions
    Given a user exists
    And there exists a post identified by "1", with privacy "public", and that belongs to user "1", with content:
      | description         | reference                                  | reference_type |
      | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
    And the user provides the post identified by "1"
    And the user provides the new content of the post being:
      | description         | reference                                           | reference_type |
      | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg          | jpg            |
      |                     | http://techslides.com/demos/sample-videos/small.mp4 | mp4            |
      |                     | https://www.gstatic.com/webp/gallery/4.jpg          | jpg            |
    When the user tries to update the post
    Then the post is updated with the new content provided

  Scenario: A logged in user tries to create a permanent post without any content
    Given a user exists
    And there exists a post identified by "1", with privacy "public", and that belongs to user "1", with content:
      | description         | reference                                  | reference_type |
      | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
    And the user provides the post identified by "1"
    And the user provides the new content of the post being:
      | description | reference | reference_type |
      |             |           | none           |
    When the user tries to update the post
    Then an error occurs: the post to create needs to have some kind of content

  Scenario: A logged in user tries to update a permanent post with only text
    Given a user exists
    And there exists a post identified by "1", with privacy "public", and that belongs to user "1", with content:
      | description         | reference                                  | reference_type |
      | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
    And the user provides the post identified by "1"
    And the user provides the new content of the post being:
      | description         | reference | reference_type |
      | This is my new post |           |                |
    When the user tries to update the post
    Then the post is updated with the new content provided

  Scenario: A logged in user tries to update a permanent post with only multimedia content
    Given a user exists
    And there exists a post identified by "1", with privacy "public", and that belongs to user "1", with content:
      | description         | reference                                  | reference_type |
      | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
    And the user provides the post identified by "1"
    And the user provides the new content of the post being:
      | description | reference                                           | reference_type |
      |             | https://www.gstatic.com/webp/gallery/1.jpg          | jpg            |
      |             | http://techslides.com/demos/sample-videos/small.mp4 | mp4            |
    When the user tries to update the post
    Then the post is updated with the new content provided

  Scenario: A logged in user tries to update a permanent post that does not exist
    Given a user exists
    And the user provides the post identified by "1"
    And the user provides the new content of the post being:
      | description         | reference                                  | reference_type |
      | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
    When the user tries to update the post
    Then an error occurs: the post with the provided id does not exist

  Scenario: A logged in user tries to update a permanent posts privacy from public to private
    Given a user exists
    And there exists a post identified by "1", with privacy "public", and that belongs to user "1", with content:
      | description         | reference                                  | reference_type |
      | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
    And the user provides the post identified by "1"
    And the user provides the new content of the post being:
      | description         | reference                                  | reference_type |
      | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
    And the user provides the new privacy of the post being "private"
    When the user tries to update the post
    Then the post is updated with the new privacy setting