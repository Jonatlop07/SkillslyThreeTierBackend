Feature: Update project

  Scenario: A logged in user tries to update a project with multimedia content and descriptions
    Given a user exists
    And there exists a project identified by "1", and that belongs to user "1", with content:
      | title         | members | description            | reference                                  | reference_type | annex                                   |
      | project title | Martin  | This is my new project | https://www.gstatic.com/webp/gallery/1.jpg | imagen         | https://www.drive.com/miNewProject1.pdf |
    And the user provides the project identified by "1"
    And the user provides the new content of the project being:
      | title         | members | description       | reference                                  | reference_type | annex                                   |
      | project_title | Sofia   | project to update | https://www.gstatic.com/webp/gallery/1.jpg | imagen         | https://www.drive.com/miNewProject1.pdf |
    When the user tries to update the project
    Then the project is updated with the new content provided

  Scenario: A logged in user tries to create a project without any content
    Given a user exists
    And there exists a project identified by "1", and that belongs to user "1", with content:
      | title         | members | description            | reference                                  | reference_type | annex                                   |
      | project title | Martin  | This is my new project | https://www.gstatic.com/webp/gallery/1.jpg | imagen         | https://www.drive.com/miNewProject1.pdf |
    And the user provides the project identified by "1"
    And the user provides the new content of the project being:
      | title | members | description | reference | reference_type | annex |
      |       |         |             |           | none           |       |
    When the user tries to update the project
    Then an error occurs: the project to create needs to have some kind of content

  Scenario: A logged in user tries to update a project with only text
    Given a user exists
    And there exists a project identified by "1", and that belongs to user "1", with content:
      | title         | members | description            | reference                                  | reference_type | annex                                   |
      | project title | Martin  | This is my new project | https://www.gstatic.com/webp/gallery/1.jpg | imagen         | https://www.drive.com/miNewProject1.pdf |
    And the user provides the project identified by "1"
    And the user provides the new content of the project being:
      | title         | members | description            | reference | reference_type | annex |
      | project title |         | This is my new project |           |                |       |
    When the user tries to update the project
    Then the project is updated with the new content provided

  Scenario: A logged in user tries to update a project with only multimedia content
    Given a user exists
    And there exists a project identified by "1", and that belongs to user "1", with content:
      | title         | members | description            | reference                                  | reference_type | annex                                   |
      | project title | Martin  | This is my new project | https://www.gstatic.com/webp/gallery/1.jpg | imagen         | https://www.drive.com/miNewProject1.pdf |
    And the user provides the project identified by "1"
    And the user provides the new content of the project being:
      | title | members | description | reference                                  | reference_type | annex |
      |       |         |             | https://www.gstatic.com/webp/gallery/1.jpg | imagen         |       |
    When the user tries to update the project
    Then the project is updated with the new content provided

  Scenario: A logged in user tries to update a project that does not exist
    Given a user exists
    And the user provides the project identified by "1"
    And the user provides the new content of the project being:
      | title         | members | description            | reference                                  | reference_type | annex                                   |
      | project title | Martin  | This is my new project | https://www.gstatic.com/webp/gallery/1.jpg | imagen         | https://www.drive.com/miNewProject1.pdf |
    When the user tries to update the project
    Then an error occurs: the project with the provided id does not exist
