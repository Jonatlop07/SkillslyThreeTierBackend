Feature: Create an user profile

  Scenario Outline: A user tries to create an user profile with data in a valid format
    Given the user provides the data: "<Resume>", "<Knowledge>", "<Talents>", "<Activities>", "<Interests>" and "<userID>"
    When user tries to create an user profile
    Then the profile is created with the data provided

    Examples:
      | Resume                | Knowledge     | Talents    | Activities           | Interests     | userID |
      | This is a test        | Maths,Physics | Music,Sing | Polo,Tennis,Swimming | Algebra,ML,IA | 1      |
      | This is a second test | Maths         | Music      | Tennis,Squash        | Mars          | 2      |

  Scenario Outline: A user tries to create an user profile with data in an invalid format
    Given the user provides the data: "<Resume>", "<Knowledge>", "<Talents>", "<Activities>", "<Interests>" and "<userID>"
    When user tries to create an user profile
    Then an error occurs: provided profile information are in an invalid format

    Examples:
      | Resume         | Knowledge      | Talents   | Activities     | Interests         | userID |
      | This is a test | 1212,23223     | 213213123 | 12             | 123878            | 1      |
      | This is a test | 1212,23223     | Guitar    | Squash, Tennis | Aeronautics, Gold | 2      |
      | This is a test | Physics, Maths | 56565     | Squash, Tennis | Blockchain        | 3      |
      | This is a test | Programming    | Piano     | 52856, Tennis  | Algorithms, ML    | 2      |
      | This is a test | Calculus       | Puzzles   | Sudoku, Math   | IA, Duke, 5688    | 1      |