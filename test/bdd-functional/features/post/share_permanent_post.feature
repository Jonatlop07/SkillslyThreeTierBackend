Feature: Share permanent post

  Scenario: A logged in user shares an existing permanent post
  Given a user exists
  And there exists a post identified by "1"
  | description         | reference                                  | reference_type |
  | This is my new post | https://www.gstatic.com/webp/gallery/1.jpg | jpg            |
  And the user provides the post identified by "1"
  When the user tries to share the post
  Then the post is shared on the profile of the user who performs the action
