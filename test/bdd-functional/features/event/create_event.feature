Feature: Create event

  Scenario Outline: A logged user tries to create an event with valid format data
    Given a user exists, is logged in, and has an id "<UserId>"
    And user provides event data: "<Name>", "<Description>", "<Lat>", "<Long>" and "<Date>"
    When user tries to create the event
    Then the event is created with the data provided

    Examples:
      | UserId | Name              | Description                   | Lat    | Long  | Date              | 
      | 1      | Jacky's PoolParty | Awesome poolparty in my house | -74.12 | 12.31 | 01/01/2000 1pm    | 
