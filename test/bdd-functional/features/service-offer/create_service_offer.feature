Feature: Creation of a service offer

  Scenario: A logged in user successfully creates a service offer
    Given a user exists
    And the user provides the details of the service being:
      | user_id | title       | service_brief                        | contact_information | category             |
      | 1       | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    When the user tries to create the service offer
    Then the service offer is created successfully with the details provided

  Scenario: A logged in user tries to create a service offer but with the details in a valid format
    Given a user exists
    And the user provides the details of the service being:
      | user_id | title | service_brief | contact_information | category |
      | 1       |       |       |                     |          |
    When the user tries to create the service offer
    Then an error occurs: the service details is in an invalid format
