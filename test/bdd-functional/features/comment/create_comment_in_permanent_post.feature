Feature: Create comment in a permanent post

  Scenario Outline: A logged user tries to add a comment in a permanent post
    Given an existing user and a permanent post
    And user provides comment data: "<Comment>" and "<Timestamp>"
    When user tries to add a comment to the post
    Then the comment is added to post

    Examples:
      | Comment                  | Timestamp           |
      | Hello world!             | 2020-01-01T00:00:00 |
      | This is a comment        | 2020-01-01T01:25:00 |
      | Test with full timestamp | 2020-01-01T12:30:33 |

  Scenario Outline: A logged user tries to add a comment in a permanent post with a void content
    Given an existing user and a permanent post
    And user provides comment data: "<Comment>" and "<Timestamp>"
    When user tries to add a comment to the post
    Then an error occurs: the comment must contain at least one character

    Examples:
      | Comment | Timestamp           |
      |         | 2020-01-01T00:00:00 |
      |         | 2020-01-01T01:25:00 |
      |         | 2020-01-01T12:30:33 |

  Scenario Outline: A logged user tries to add a comment in a permanent post with a timestamp in an invalid format
    Given an existing user and a permanent post
    And user provides comment data: "<Comment>" and "<Timestamp>"
    When user tries to add a comment to the post
    Then an error occurs: the comment timestamp must be in the format "YYYY-MM-DDTHH:MM:SS"

    Examples:
      | Comment                   | Timestamp           |
      | This is a test of comment | 01-01-2000T00:00:00 |
      | This is a test of comment | 01-2000-01T00:00:00 |
      | This is a test of comment | 2000-01-01T00:00    |
      | This is a test of comment | 2000-01-01T00       |
      | This is a test of comment | 2000/01/01T00:00:00 |
      | This is a test of comment | 2000/01/01T00:00    |
      | This is a test of comment | 2000/01/01T00       |
      | This is a test of comment | 2000/01/01          |
      | This is a test of comment |                     |
      |                           |                     |