Feature: Get comments of a permanent post

  Scenario: A logged user tries to get all comments of a permanent post
    Given an existing user and a permanent post
    And there exists comments in the post, being:
      | comment                    | timestamp           |
      | this is the first comment  | 2020-01-01T00:00:00 |
      | this is the second comment | 2020-01-01T00:00:01 |
      | this is the third comment  | 2020-01-01T00:00:02 |
      | this is the fourth comment | 2020-01-01T00:00:03 |
      | this is the fifth comment  | 2020-01-01T00:00:04 |
      | this is the sixth comment  | 2020-01-01T00:00:05 |
    When the user tries to get all comments of the post
    Then the user should get all the comments in the post
