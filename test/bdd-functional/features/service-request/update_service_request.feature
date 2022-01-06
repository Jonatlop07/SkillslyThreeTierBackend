Feature: Update of a service request

  Scenario: A logged in requester successfully updates a service request
    Given a requester exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 1       | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And the requester provides the details of the request to be updated:
      | service_request_id | title           | service_brief                  | contact_information | category             |
      | 1                | Service updated | This the service brief updated | Cellphone 334234    | Software Development |
    When the requester tries to update the details of the service request
    Then the service request is updated successfully with the details provided

  Scenario: A logged in requester tries to update a service request but with the details in a invalid format
    Given a requester exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 1       | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And the requester provides the details of the request to be updated:
      | service_request_id | title | service_brief                  | contact_information | category             |
      | 1                |       | This the service brief updated | Cellphone 334234    | Software Development |
    When the requester tries to update the details of the service request
    Then an error occurs: some details of the service request are in an invalid format

  Scenario: A logged in requester tries to update a service request that does not exist
    Given a requester exists
    And the requester provides the details of the request to be updated:
      | service_request_id | title           | service_brief                  | contact_information | category             |
      | 1                | Updated service | This the service brief updated | Cellphone 334234    | Software Development |
    When the requester tries to update the details of the service request
    Then an error occurs: the service request to be updated does not exist
