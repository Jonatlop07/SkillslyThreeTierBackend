Feature: Get service request applications 

  Scenario: A requester gets the collection of applications to a service request
    Given a requester exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 1            | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And there exists a service request application from user with id "2", to request with id "1" and application message being "I would like to apply because..."
    And the requester provides the request id being "1"
    When the requester tries to get the service request applications
    Then the collection of applications is returned

  Scenario: A requester tries to get the collection of applications to a service request that does not exist
    Given a requester exists
    And the requester provides the request id being "1"
    When the requester tries to get the service request applications
    Then an error occurs: the service request does not exist