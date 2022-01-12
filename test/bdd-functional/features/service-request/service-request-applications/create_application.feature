Feature: Create service request application

  Scenario: A user applies to a service request
    Given a user exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 2            | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And the user provides the service request id being "1" and application message being "I would like to apply because..."
    When the user tries to apply to the service request
    Then the appliance is created
  
  Scenario: A user tries to apply to a service request that does not exist
    Given a user exists
    And the user provides the service request id being "1" and application message being "I would like to apply because..."
    When the user tries to apply to the service request
    Then an error occurs: the service request does not exist




