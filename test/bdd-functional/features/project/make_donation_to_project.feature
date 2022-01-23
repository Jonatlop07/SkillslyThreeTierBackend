Feature: Make a donation to a project
  Scenario: An investor successfully makes a donation to a project
    Given a user exists
    And an investor exists
    And the user has created the project:
      | title         | members | description            | reference                                           | reference_type | annex                                   |
      | project title | Martin  | This is my new project | https://www.gstatic.com/webp/gallery/1.jpg          | imagen         | https://www.drive.com/miNewProject1.pdf |
      | title 2       | Jorge   | This is my new project | https://www.gstatic.com/webp/gallery/2.jpg          | imagen         | https://www.drive.com/miNewProject2.pdf |
      | title 3       | Carlos  | This is my new project | https://www.gstatic.com/webp/gallery/4.jpg          | imagen         | https://www.drive.com/miNewProject3.pdf |
      | title 4       | Lucia   | This is my new project | http://techslides.com/demos/sample-videos/small.mp4 | imagen         | https://www.drive.com/miNewProject4.pdf |
    When the investor tries to make a donation to the project
    Then the donation is successfully made
