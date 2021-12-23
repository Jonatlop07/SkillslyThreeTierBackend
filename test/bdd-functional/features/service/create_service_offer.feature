Feature: Creation of a service offer

  Scenario: A logged in user successfully creates a service offer
    Given a user exists
    And the user provides the information of the service being:
      | title       | brief                                | contact_information | category             |
      | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    When the user tries to create the service offer
    Then the service offer is created successfully with the information provided

  Scenario: A logged in user tries to create a service offer but with the information in a valid format
    Given a user exists
    And the user provides the information of the service being:
      | title | brief | contact_information | category |
      |       |       |                     |          |
    When the user tries to create the service offer
    Then an error occurs: the service information is in an invalid format
