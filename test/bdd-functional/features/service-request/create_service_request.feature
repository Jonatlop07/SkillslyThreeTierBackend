Feature: Create Service Request

  Scenario: A logged in requester successfully creates a service request
    Given a requester exists
    And the user provides the details of the service being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 1            | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    When the requester tries to create the service request
    Then the service request is created successfully with the details provided

  Scenario: A logged in requester tries to create a service request but with the details in a invalid format
    Given a requester exists
    And the requester provides the details of the service being:
      | requester_id | title | service_brief | contact_information | category |
      | 1            |       |               |                     |          |
    When the requester tries to create the service request
    Then an error occurs: the service details is are an invalid format
