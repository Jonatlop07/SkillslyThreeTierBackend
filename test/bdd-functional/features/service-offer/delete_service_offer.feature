Feature: Delete Service Offer

  Scenario Outline: A logged in user successfully deletes a service offer
    Given these users exists:
      | email                | password  | name | date_of_birth |
      | newuser_123@test.com | Abc123_tr | Juan | 01/01/2000    |
    And there exists a service offer with the details being:
      | owner_id | title       | service_brief                        | contact_information | category             |
      | 1       | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    When the user identified by "<UserId>" tries to delete the service offer with id "<ServiceOfferId>"
    Then the service offer is successfully deleted
    Examples:
      | UserId | ServiceOfferId |
      | 1      | 1              |

  Scenario Outline: A logged in user tries to delete a service offer that does not exist
    Given these users exists:
      | email                | password  | name | date_of_birth |
      | newuser_123@test.com | Abc123_tr | Juan | 01/01/2000    |
    When the user identified by "<UserId>" tries to delete the service offer with id "<ServiceOfferId>"
    Then an error occurs: the service offer to be deleted does not exist
    Examples:
      | UserId | ServiceOfferId |
      | 1      | 1              |

  Scenario Outline: A logged in user tries to delete a service offer that does not belong to them
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And there exists a service offer with the details being:
      | owner_id | title       | service_brief                        | contact_information | category             |
      | 1       | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    When the user identified by "<UserId>" tries to delete the service offer with id "<ServiceOfferId>"
    Then an error occurs: the service offer does not belong to the user
    Examples:
      | UserId | ServiceOfferId |
      | 2      | 1              |
