Feature: Query Service Offers of User

  Scenario Outline: A user successfully queries the service offers of another user
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And there exist service offers with the details being:
      | owner_id | title            | service_brief                        | contact_information | category |
      | 2       | Software service | This is a new service i have created | Cellphone 334234    | Software |
      | 1       | Science service  | This is a new service i have created | Cellphone 334234    | Science  |
      | 2       | Medicine service | This is a new service i have created | Cellphone 334234    | Medicine |
      | 1       | Art service      | This is a new service i have created | Cellphone 334234    | Art      |
    When a user tries to query the service offers of the user "<OwnerId>"
    Then the service offers of the user are returned
    Examples:
      | OwnerId |
      | 1       |
      | 2       |
