Feature: Create permanent post

  Scenario Outline: A logged in user creates a permanent post successfully
    Given a user with the id "<id>" exists
    And the user provides the text of the post being "<ContentText>"
    And the user provides the images of the post being "<References>" if there is any images
    When the user tries to create a new post
    Then a post is then created with the content text and images provided

    Examples:
      | id  | ContentText         | References                                                                                                                         |
      | 1   | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg, https://www.gstatic.com/webp/gallery/2.jpg, https://www.gstatic.com/webp/gallery/4.jpg |

  Scenario Outline: A logged in user tries to create a permanent post without any content
    Given a user with the id "<id>" exists
    When the user tries to create a new post
    Then an error occurs: the post to create needs to have some kind of content

    Examples:
      | id  | ContentText | References  |
      | 1   |             |             |

  Scenario Outline: A logged in user tries to create a permanent post composed of only text
    Given a user with the id "<id>" exists
    And the user provides the text of the post being "<ContentText>"
    When the user tries to create a new post
    Then a post is then created with the text provided

    Examples:
      | id  | ContentText         |
      | 1   | This is my new post |

  Scenario Outline: A logged in user tries to create a permanent post composed of only images
    Given a user with the id "<id>" exists
    And the user provides the images of the post being "<References>"
    When the user tries to create a new post
    Then a post is then created with the images provided

    Examples:
      | id  |  Images               |
      | 1   |                       |

