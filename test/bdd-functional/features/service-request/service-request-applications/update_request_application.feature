Feature: Accept/confirm/deny service request application relationship

  Scenario: A service requester accepts an existing service request application
    Given a requester exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 1            | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And there exists a service request application from user with id "2", to request with id "1" and application message being "I would like to apply because..."
    And the requester provides the request id being "1", applicant id being "2" and action being "accept"
    When the requester tries to update the service request application
    Then the application is accepted and the service phase is updated to evaluation

  Scenario: A service requester confirms an existing service request application in evaluation phase
    Given a requester exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 1            | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And there exists a service request application from user with id "2", to request with id "1" that has been accepted
    And the requester provides the request id being "1", applicant id being "2" and action being "confirm"
    When the requester tries to update the service request application
    Then the application is accepted and the service phase is updated to execution

  Scenario: A service requester denies an existing service request application
    Given a requester exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 1            | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And there exists a service request application from user with id "2", to request with id "1" that has been accepted
    And the requester provides the request id being "1", applicant id being "2" and action being "deny"
    When the requester tries to update the service request application
    Then the application is denied and the service goes back to open

  Scenario: A service requester tries to accept a service request application but the request is in evaluation phase
    Given a requester exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 1            | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And there exists a service request application from user with id "2", to request with id "1" that has been accepted
    And there exists a service request application from user with id "3", to request with id "1" and application message being "I would like to apply because..."
    And the requester provides the request id being "1", applicant id being "3" and action being "accept"
    When the requester tries to update the service request application
    Then an error occurs: a service request application is already being evaluated for the request therefore the owner can not accept another one

  Scenario: A service requester tries to accept a service request application that does not exist
    Given a requester exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 1            | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And the requester provides the request id being "1", applicant id being "2" and action being "accept"
    When the requester tries to update the service request application
    Then an error occurs: the service request application to accept does not exist