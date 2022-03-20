Feature: Create a temporal post

  Scenario Outline: A logged user creates a temporal post
    Given an existing user
    And the user provides content of the temporal post: "<Description>", "<Reference>" and "<ReferenceType>"
    When the user tries to create a new temporal post
    Then the temporal post is created successfully

    Examples:
      | Description     | Reference                                           | ReferenceType |
      | A temporal post | https://www.gstatic.com/webp/gallery/4.jpg          | jpg           |
      |                 | https://www.gstatic.com/webp/gallery/4.jpg          | jpg           |
      | A temporal post | http://techslides.com/demos/sample-videos/small.mp4 | mp4           |
      |                 | http://techslides.com/demos/sample-videos/small.mp4 | mp4           |

  Scenario Outline: A logged user creates a temporal post with an invalid reference
    Given an existing user
    And the user provides content of the temporal post: "<Description>", "<Reference>" and "<ReferenceType>"
    When the user tries to create a new temporal post
    Then an error occurs: post must have a valid reference

    Examples:
      | Description     | Reference             | ReferenceType |
      | A temporal post | referencex            | jpg           |
      |                 | invalidref.com        | jpg           |
      |                 | thisisatest reference | mp4           |

  Scenario Outline: A logged user creates a temporal post with an invalid reference type
    Given an existing user
    And the user provides content of the temporal post: "<Description>", "<Reference>" and "<ReferenceType>"
    When the user tries to create a new temporal post
    Then an error occurs: post must have a valid reference type
    Examples:
      | Description     | Reference                                   | ReferenceType |
      | A temporal post | https://www.gstatic.com/webp/gallery/4.docx | docx          |
      |                 | https://www.gstatic.com/webp/gallery/5.pdf  | pdf           |
      |                 | https://www.gstatic.com/webp/gallery/6.mp3  | mp3           |

  Scenario Outline: A logged user creates a temporal post without any content
    Given an existing user
    And the user provides content of the temporal post: "<Description>", "<Reference>" and "<ReferenceType>"
    When the user tries to create a new temporal post
    Then an error occurs: post must have a valid content
    Examples:
      | Description | Reference | ReferenceType |
      |             |           |               |
