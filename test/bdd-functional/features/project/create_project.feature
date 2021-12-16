Feature: Create project

    Scenario: A logged in user creates a project successfully
        Given a user exists
        And the user identified by "2", provides the content of the proyect being:
            | title         | members | description            | reference                                           | reference_type | annex                                   |
            | project title | Martin  | This is my new project | https://www.gstatic.com/webp/gallery/1.jpg          | imagen         | https://www.drive.com/miNewProject1.pdf |
            | title 2       | Jorge   | This is my new project | https://www.gstatic.com/webp/gallery/2.jpg          | imagen         | https://www.drive.com/miNewProject2.pdf |
            | title 3       | Carlos  | This is my new project | https://www.gstatic.com/webp/gallery/4.jpg          | imagen         | https://www.drive.com/miNewProject3.pdf |
            | title 4       | Lucia   | This is my new project | http://techslides.com/demos/sample-videos/small.mp4 | imagen         | https://www.drive.com/miNewProject4.pdf |
        When the user tries to create a new project
        Then a project is then created with the content provided

    Scenario: A logged in user tries to create a project without any content
        Given a user exists
        And the user identified by "2", provides the content of the proyect being:
            | title | members | description | reference | reference_type | annex |
            |       |         |             |           |                |       |
        When the user tries to create a new project
        Then an error occurs: the project to create needs to have some kind of content