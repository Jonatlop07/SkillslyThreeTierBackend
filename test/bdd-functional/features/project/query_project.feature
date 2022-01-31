Feature: Query project

  Scenario: A logged in user tries to query a project
    Given a user exists
    And there exists a project identified by "1" and that belongs to user "1", with content:
      | title         | members | description            | reference                                           | reference_type | annex                                   |
      | project title | Martin  | This is my new project | https://www.gstatic.com/webp/gallery/1.jpg          | imagen         | https://www.drive.com/miNewProject1.pdf |
      | title 2       | Jorge   | This is my new project | https://www.gstatic.com/webp/gallery/2.jpg          | imagen         | https://www.drive.com/miNewProject2.pdf |
      | title 3       | Carlos  | This is my new project | https://www.gstatic.com/webp/gallery/4.jpg          | imagen         | https://www.drive.com/miNewProject3.pdf |
      | title 4       | Lucia   | This is my new project | http://techslides.com/demos/sample-videos/small.mp4 | imagen         | https://www.drive.com/miNewProject4.pdf |
    And the user provides the id of the id of the owner user being "1"
    When the user tries to query the project
    Then the projects is then returned

  Scenario: A logged in user tries to query a project from a user that does not exist
    Given a user exists
    And the user provides the id of the id of the owner user being "2"
    When the user tries to query the project
    Then an error occurs: the user with the provided id does not exist