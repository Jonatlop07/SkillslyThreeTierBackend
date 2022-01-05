Feature: Delete permanent post

    Scenario:A logged in user tries to delete their permanent post
        Given a user exists
        And there exists a post identified by "1", and that belongs to user "1"
            | description         | reference                                  | reference_type |
            | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
        And the user provides the post identified by "1"
        When the user tries to delete their permanent post
        Then the permanent post no longer exists

    Scenario: A logged in user tries to delete a group permanent post that belongs to them or the user is an admin
        Given a user exists
        And there exists a group identified by "1", owned by user with id "1", with info being:
            | name       | description                        | category       | picture                                                              |
            | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |
        And there exists a post identified by "1", and that belongs to user "1", and group "1", with content being:
            | description         | reference                                  | reference_type |
            | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
        And the user provides the post identified by "1" and the group identified by "1"
        When the user tries to delete the permanent post from the group
        Then the permanent post is deleted from the group

    Scenario: A logged in user tries to delete a group permanent post that doesn't belongs to them and the user isn't an admin
        Given a user exists
        And there exists a group identified by "1", owned by user with id "2", with info being:
            | name       | description                        | category       | picture                                                              |
            | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |
        And there exists a post identified by "1", and that belongs to user "2", and group "1", with content being:
            | description         | reference                                  | reference_type |
            | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
        And the user provides the post identified by "1" and the group identified by "1"
        When the user tries to delete the permanent post from the group
        Then an error occurs: the user must own the post or be an admin to remove it
