Feature: Create permanent post

  Scenario: A logged in user creates a permanent post successfully
    Given a user exists
    And the user provides the content of the post being:
    | description         | reference                                           | reference_type |
    | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg          | jpg            |
    |                     | https://www.gstatic.com/webp/gallery/2.jpg          | jpg            |
    |                     | https://www.gstatic.com/webp/gallery/4.jpg          | jpg            |
    |                     | http://techslides.com/demos/sample-videos/small.mp4 | mp4            |

    When the user tries to create a new post
    Then a post is then created with the content text and references provided

  Scenario: A logged in user tries to create a permanent post without any content
    Given a user exists
    And the user provides the content of the post being:
    | description | reference  | reference_type |
    |             |            |                |
    When the user tries to create a new post
    Then an error occurs: the post to create needs to have some kind of content

  Scenario: A logged in user tries to create a permanent post composed of only text
    Given a user exists
    And the user provides the content of the post being:
    | description         | reference  | reference_type |
    | This is my new post |            |                |

    When the user tries to create a new post
    Then a post is then created with the text provided


  Scenario: A logged in user tries to create a permanent post composed of only images
    Given a user exists
    And the user provides the content of the post being:
    | description         | reference                                           | reference_type |
    |                     | https://www.gstatic.com/webp/gallery/1.jpg          | jpg            |
    |                     | https://www.gstatic.com/webp/gallery/2.jpg          | jpg            |
    |                     | http://techslides.com/demos/sample-videos/small.mp4 | mp4            |

    When the user tries to create a new post
    Then a post is then created with the images provided


