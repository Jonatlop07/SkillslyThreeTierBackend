Feature: Query Service Requests by Categories

  Scenario: A user successfully queries the service requests by categories
    Given these users exists:
      | email                 | password  | name | date_of_birth |
      | newuser_123@test.com  | Abc123_tr | Juan | 01/01/2000    |
      | newuser_1234@test.com | Abc123_tr | John | 01/01/2000    |
    And there exist service requests with the details being:
      | user_id | title            | service_brief                                | contact_information | category |
      | 2       | Software service | This is a new service request i have created | Cellphone 334234    | Software |
      | 1       | Science service  | This is a new service request i have created | Cellphone 334234    | Science  |
      | 2       | Medicine service | This is a new service request i have created | Cellphone 334234    | Medicine |
      | 1       | Art service      | This is a new service request i have created | Cellphone 334234    | Art      |
    And a user provides the following categories:
      | category |
      | Software |
      | Art      |
    When the user queries the service requests by the provided categories
    Then the matching service requests are returned
