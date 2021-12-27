Feature: Update event

  Scenario Outline: A logged user tries to update an event with valid format data
    Given a user exists, is logged in, and has an id "<UserId>"
    And there exists an event identified by "<EventId>"
    And the user provides the new content of the event being:
      | Name          | Description          | Lat    | Long  | Date           |
      | StudyRoom     | This is my new event | -74.12 | 34.45 | 01/01/2000 1pm |
    When the user tries to update the event
    Then the event is updated with the new data provided
    
    Examples:
      | UserId | EventId | 
      | 1      | 2       | 