Feature: Delete Service Offer

  Scenario: A logged in user successfully deletes a service offer
    Given a user exists
    And there exists a service offer with the details being:
      | user_id | title       | service_brief                        | contact_information | category             |
      | 1       | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    When the user tries to delete the service offer with id "1"
    Then the service offer is successfully deleted

  Scenario: A logged in user tries to delete a service offer that does not exist
    Given a user exists
    When the user tries to delete the service offer with id "1"
    Then an error occurs: the service offer to be deleted does not exist
