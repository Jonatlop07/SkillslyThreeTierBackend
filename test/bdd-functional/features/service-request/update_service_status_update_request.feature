Feature: Cancel or Accept service completion or deletion request 

  Scenario: A requester accept a service completion or deletion request
    Given a provider exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 2            | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And there exists a service request application from the provider to the service request that has been accepted
    And the provider provides the id of the service request being "1" and action being "complete"
    And the completion or deletion request is created
    And the requester provides the id of the service request being "1" and action being "complete"
    When the requester tries to update the completion or deletion request
    Then the completion or deletion request is accepted and the service request status is updated to closed

  Scenario: A requester cancel a service completion or deletion request
    Given a provider exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 2            | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And there exists a service request application from the provider to the service request that has been accepted
    And the provider provides the id of the service request being "1" and action being "complete"
    And the completion or deletion request is created
    And the requester provides the id of the service request being "1" and action being "cancel"
    When the requester tries to update the completion or deletion request
    Then the completion or deletion request is canceled 

