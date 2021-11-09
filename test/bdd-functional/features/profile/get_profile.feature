Feature: Get a user profile

  Scenario Outline: A user tries to get an user profile
    Given the user id <"userID"> is provided in a valid format
    When user tries to get an user profile
    Then the user profile is obtained

    Examples:
      | userID |
      | 1      |

#  Scenario Outline: A user tries to get an user profile using an id in an invalid format
#    Given the user id <"userID"> is provided in an invalid format
#    When user tries to get an user profile
#    Then an error occurs: provided user id is in an invalid format
#
#    Examples:
#      | userID |
#      | user   |
#      | id     |