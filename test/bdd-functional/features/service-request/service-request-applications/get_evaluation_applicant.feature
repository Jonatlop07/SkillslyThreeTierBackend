Feature: Get service request evaluation applicant

  Scenario: A requester gets the user being evaluated to complete a service request
    Given a requester exists
    And there exists a service request with the details being:
      | requester_id | title       | service_brief                        | contact_information | category             |
      | 1            | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And there exists a service request application from user with id "2", to request with id "1" that has been accepted
    And the requester provides the request id being "1"
    When the requester tries to get the service request applicant being evaluated
    Then the applicant is returned