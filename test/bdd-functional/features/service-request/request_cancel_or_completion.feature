Feature: Create service request completion or cancelling request

  Scenario: A provider creates a service completion request
    Given a provider exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 2            | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And there exists a service request application from the provider to the service request that has been accepted
    And the provider provides the id of the service request being "1" and action being "complete"
    When the provider tries to request to update the service status
    Then the completion request is created
  
  Scenario: A provider creates a service cancelling request
    Given a provider exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 2            | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And there exists a service request application from the provider to the service request that has been accepted
    And the provider provides the id of the service request being "1" and action being "cancel"
    When the provider tries to request to update the service status
    Then the deletion request is created

  Scenario: A provider tries to create a service completion request but they have already requested it
    Given a provider exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 2            | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And there exists a service request application from the provider to the service request that has been accepted
    And there already exists a request to complete or cancel the service from the provider
    And the provider provides the id of the service request being "1" and action being "complete"
    When the provider tries to request to update the service status
    Then an error occurs: a request to complete or cancel the service already exists


