Feature: Delete permanent post

    Scenario:A logged in user tries to delete their permanent post
        Given a user exists
        And there exists a post identified by "1", and that belongs to user "1"
            | description         | reference                                  | reference_type |
            | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
        And the user provides the post identified by "1"
        When the user tries to delete their permanent post
        Then the permanent post no longer exists
