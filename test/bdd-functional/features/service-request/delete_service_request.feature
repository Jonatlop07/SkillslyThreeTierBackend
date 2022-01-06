Feature: Delete Service Request

  Scenario: A logged in requester successfully deletes a service request
    Given a requester exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 1       | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    When the requester tries to delete the service request with id "1"
    Then the service request is successfully deleted

  Scenario: A logged in requester tries to delete a service request that does not exist
    Given a requester exists
    When the requester tries to delete the service request with id "1"
    Then an error occurs: the service request to be deleted does not exist
