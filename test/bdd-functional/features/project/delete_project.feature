Feature: Delete project

  Scenario:A logged in user tries to delete their project
    Given a user exists
    And there exists a project identified by "1", and that belongs to user "1"
      | title         | members | description            | reference                                           | reference_type | annex                                   |
      | project title | Martin  | This is my new project | https://www.gstatic.com/webp/gallery/1.jpg          | imagen         | https://www.drive.com/miNewProject1.pdf |
    And the user provides the project identified by "1"
    When the user tries to delete their project
    Then the project no longer exists