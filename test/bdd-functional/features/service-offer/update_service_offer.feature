Feature: Update of a service offer

  Scenario: A logged in user successfully updates a service offer
    Given a user exists
    And there exists a service offer with the details being:
      | user_id | title       | service_brief                        | contact_information | category             |
      | 1       | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And the user provides the details of the offer to be updated:
      | service_offer_id | title           | service_brief                  | contact_information | category             |
      | 1                | Service updated | This the service brief updated | Cellphone 334234    | Software Development |
    When the user tries to update the details of the service offer
    Then the service offer is updated successfully with the details provided

  Scenario: A logged in user tries to update a service offer but with the details in a invalid format
    Given a user exists
    And there exists a service offer with the details being:
      | user_id | title       | service_brief                        | contact_information | category             |
      | 1       | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And the user provides the details of the offer to be updated:
      | service_offer_id | title | service_brief                  | contact_information | category             |
      | 1                |       | This the service brief updated | Cellphone 334234    | Software Development |
    When the user tries to update the details of the service offer
    Then an error occurs: some details of the service offer are in an invalid format

  Scenario: A logged in user tries to update a service offer that does not exist
    Given a user exists
    And the user provides the details of the offer to be updated:
      | service_offer_id | title           | service_brief                  | contact_information | category             |
      | 1                | Updated service | This the service brief updated | Cellphone 334234    | Software Development |
    When the user tries to update the details of the service offer
    Then an error occurs: the service offer to be updated does not exist
