Feature: Create group

  Scenario Outline: A logged in user creates a group successfully
    Given a user exists
    And the user provides the information of the group being: "<Name>", "<Description>", "<Category>" and "<Picture>"
    When the user tries to create a new group
    Then a group is then created with the information provided

    Examples:
      | Name       | Description                        | Category       | Picture                                                              |
      | Tech Group | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |
      | Painting   | This is a new group about painting | Painting       |                                                                      |
      | DesignMe   | This is a new group for designers  | Graphic Design | https://pbs.twimg.com/media/D-jnKUPU4AE3hVR.jpg                      |

  Scenario Outline: A logged in user tries to create a group with information in an invalid format
    Given a user exists
    And the user provides the information of the group being: "<Name>", "<Description>", "<Category>" and "<Picture>"
    When the user tries to create a new group
    Then an error occurs: the group must have at least a name, a description and a category

    Examples:
      | Name       | Description                        | Category       | Picture                                                              |
      |            | This is a new group of tech stuff  | Development    | https://static-cse.canva.com/blob/573718/beautifultwitterbanners.jpg |
      | Painting   |                                    | Painting       |                                                                      |
      | DesignMe   | This is a new group for designers  |                | https://pbs.twimg.com/media/D-jnKUPU4AE3hVR.jpg                      |  
