Feature: Update of a service offer

  Scenario Outline: A logged in user successfully updates a service offer
    Given these users exists:
      | email                | password  | name | date_of_birth |
      | newuser_123@test.com | Abc123_tr | Juan | 01/01/2000    |
    And there exists a service offer with the details being:
      | user_id | title       | service_brief                        | contact_information | category             |
      | 1       | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And the user identified by "<UserId>" provides the details of the offer to be updated:
      | service_offer_id | title           | service_brief                  | contact_information | category             |
      | 1                | Service updated | This the service brief updated | Cellphone 334234    | Software Development |
    When the user tries to update the details of the service offer
    Then the service offer is updated successfully with the details provided
    Examples:
      | UserId |
      | 1      |

  Scenario Outline: A logged in user tries to update a service offer but with the details in a invalid format
    Given these users exists:
      | email                | password  | name | date_of_birth |
      | newuser_123@test.com | Abc123_tr | Juan | 01/01/2000    |
    And there exists a service offer with the details being:
      | user_id | title       | service_brief                        | contact_information | category             |
      | 1       | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And the user identified by "<UserId>" provides the details of the offer to be updated:
      | service_offer_id | title | service_brief                  | contact_information | category             |
      | 1                |       | This the service brief updated | Cellphone 334234    | Software Development |
    When the user tries to update the details of the service offer
    Then an error occurs: some details of the service offer are in an invalid format
    Examples:
      | UserId |
      | 1      |

  Scenario Outline: A logged in user tries to update a service offer that does not exist
    Given these users exists:
      | email                | password  | name | date_of_birth |
      | newuser_123@test.com | Abc123_tr | Juan | 01/01/2000    |
    And the user identified by "<UserId>" provides the details of the offer to be updated:
      | service_offer_id | title           | service_brief                  | contact_information | category             |
      | 1                | Updated service | This the service brief updated | Cellphone 334234    | Software Development |
    When the user tries to update the details of the service offer
    Then an error occurs: the service offer to be updated does not exist
    Examples:
      | UserId |
      | 1      |

  Scenario Outline: A logged in user tries to update a service offer that does not belong to them
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And there exists a service offer with the details being:
      | user_id | title       | service_brief                        | contact_information | category             |
      | 1       | New service | This is a new service i have created | Cellphone 334234    | Software Development |
    And the user identified by "<UserId>" provides the details of the offer to be updated:
      | service_offer_id | title | service_brief                  | contact_information | category             |
      | 1                |       | This the service brief updated | Cellphone 334234    | Software Development |
    When the user tries to update the details of the service offer
    Then an error occurs: the service offer does not belong to the user
    Examples:
      | UserId |
      | 2      |
