Feature: Edit an user profile

  Scenario: An user tries to edit his user profile
    Given an existing user
    And there exists a profile belongs to that user, with content:
      | resume                         | knowledge        | talents                   | activities                 | interests |
      | This is a resume of my profile | Python,Java,Ruby | Algorithms,DataStructures | Programming,WebDevelopment | IA,ML     |
    And user provides the new content of the user profile :
      | resume                             | knowledge | talents    | activities                 | interests     |
      | This is a new resume of my profile | Python    | Algorithms | Programming,WebDevelopment | IA,ML,GraphQL |
    When user tries to update his profile
    Then the profile is updated with new provided content


  Scenario: An user tries to edit his user profile without any content
    Given an existing user
    And there exists a profile belongs to that user, with content:
      | resume                         | knowledge        | talents                   | activities                 | interests |
      | This is a resume of my profile | Python,Java,Ruby | Algorithms,DataStructures | Programming,WebDevelopment | IA,ML     |
    And user provides the new content of the user profile :
      | resume | knowledge | talents | activities | interests |
      |        |           |         |            |           |
    When user tries to update his profile
    Then an error occurs: content should not be empty

  Scenario: An user tries to edit his user profile changing only the resume
    Given an existing user
    And there exists a profile belongs to that user, with content:
      | resume                         | knowledge        | talents                   | activities      | interests |
      | This is a resume of my profile | Python,Java,Ruby | Algorithms,DataStructures | Programming,Web | IA,ML     |
    And user provides the new content of the user profile :
      | resume                             | knowledge | talents | activities | interests |
      | This is a new resume of my profile |           |         |            |           |
    When user tries to update his profile
    Then the profile is updated with new provided content

  Scenario: An user tries to edit his user profile changing only the knowledge
    Given an existing user
    And there exists a profile belongs to that user, with content:
      | resume                         | knowledge        | talents                   | activities      | interests |
      | This is a resume of my profile | Python,Java,Ruby | Algorithms,DataStructures | Programming,Web | IA,ML     |
    And user provides the new content of the user profile :
      | resume | knowledge     | talents | activities | interests |
      |        | Maths,Physics |         |            |           |
    When user tries to update his profile
    Then the profile is updated with new provided content


  Scenario: An user tries to edit his user profile changing only the talents
    Given an existing user
    And there exists a profile belongs to that user, with content:
      | resume                         | knowledge        | talents                   | activities      | interests |
      | This is a resume of my profile | Python,Java,Ruby | Algorithms,DataStructures | Programming,Web | IA,ML     |
    And user provides the new content of the user profile :
      | resume | knowledge | talents      | activities | interests |
      |        |           | Guitar,Piano |            |           |
    When user tries to update his profile
    Then the profile is updated with new provided content


  Scenario: An user tries to edit his user profile changing only the activities
    Given an existing user
    And there exists a profile belongs to that user, with content:
      | resume                         | knowledge        | talents                   | activities      | interests |
      | This is a resume of my profile | Python,Java,Ruby | Algorithms,DataStructures | Programming,Web | IA,ML     |
    And user provides the new content of the user profile :
      | resume | knowledge | talents | activities         | interests |
      |        |           |         | Tennis,Polo,Squash |           |
    When user tries to update his profile
    Then the profile is updated with new provided content


  Scenario: An user tries to edit his user profile changing only the interests
    Given an existing user
    And there exists a profile belongs to that user, with content:
      | resume                         | knowledge        | talents                   | activities      | interests |
      | This is a resume of my profile | Python,Java,Ruby | Algorithms,DataStructures | Programming,Web | IA,ML     |
    And user provides the new content of the user profile :
      | resume | knowledge | talents | activities | interests                     |
      |        |           |         |            | MachineLearning,GraphQL,Neo4j |
    When user tries to update his profile
    Then the profile is updated with new provided content