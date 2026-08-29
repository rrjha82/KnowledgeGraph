import { AIProvider } from "../models/AIProvider";

export class MockAIProvider implements AIProvider {

    async ask(prompt: string): Promise<string> {

        // ==============================================
        // BDD Generation
        // ==============================================

        if (
            prompt.includes(
                "Generate a business-readable Gherkin BDD scenario"
            )
        ) {

            return `
Feature: User Registration

Scenario: Successfully register a new user

  Given the user is on the OpenCart home page
  When the user opens the My Account menu
  And the user selects the Register option
  And the user enters a valid first name
  And the user enters a valid last name
  And the user enters a valid email address
  And the user enters a valid telephone number
  And the user enters a valid password
  And the user confirms the password
  And the user accepts the Terms and Conditions
  And the user clicks Continue
  Then the account registration confirmation should be displayed
  And the confirmation message should be "Your Account Has Been Created!"
`;
        }


        // ==============================================
        // Method Explanation
        // ==============================================

        if (
            prompt.includes(
                "You are an expert Playwright Automation Engineer"
            ) &&
            prompt.includes(
                "Purpose of this method"
            )
        ) {

            return `
Method Explanation
==================

Method:
Registrationpage.completeRegistration

1. Purpose of the Method
-------------------------
The method completes the OpenCart user registration process.

It coordinates the registration steps by calling the individual
methods responsible for entering user information, accepting the
privacy policy, and continuing the registration.

2. Business Functionality
-------------------------
The method represents the business process of registering a new
customer account in OpenCart.

The registration information includes:

- First Name
- Last Name
- Email
- Telephone
- Password
- Confirm Password

The method also accepts the privacy policy before continuing.

3. Playwright Flow
------------------
The method calls the following page-object methods:

1. setFirstName()
2. setLastName()
3. setEmail()
4. setTelephone()
5. setPassword()
6. setConfirmPassword()
7. setPrivacyPolicy()
8. clickContinue()

The actual browser interactions are implemented inside those
individual page-object methods.

4. Locators Involved
--------------------
The method indirectly uses:

- txtFirstName
- txtLastName
- txtEmail
- txtTelephone
- txtPassword
- txtConfirmpassword
- chkdPolicy
- btnContinue

5. Possible Validations
-----------------------
Possible validations supported by the available context include:

- Registration form accepts the supplied information.
- Password and confirmation password are provided.
- Privacy policy is accepted.
- Registration can be continued.

6. BDD Scenario
---------------
Feature: User Registration

Scenario: Complete user registration

  Given the user is on the registration page
  When the user enters the required registration information
  And the user accepts the privacy policy
  And the user continues with the registration
  Then the registration process should be completed
`;
        }


        // ==============================================
        // Default Response
        // ==============================================
        // ==============================================
// Impact Analysis
// ==============================================

if (
    prompt.includes(
        "Software Impact Analysis Engineer"
    )
) {

    return `
Impact Analysis
===============

Changed Locator:
txtPassword

Risk Level:
HIGH

Affected Methods:
- LoginPage.setPassword
- Registrationpage.setPassword
- LoginPage.login
- Registrationpage.completeRegistration

Affected Tests:
- user registration test

Why are these methods affected?
--------------------------------
The locator txtPassword is used by password-related
methods in both the LoginPage and Registrationpage.

LoginPage.setPassword uses the locator to enter the
user password during login.

Registrationpage.setPassword uses the same locator
during account registration.

The higher-level login and registration methods depend
on these methods, so they are also affected.

Why is the test affected?
-------------------------
The user registration test calls:

- Registrationpage.setPassword
- Registrationpage.completeRegistration

Therefore, a change to txtPassword can affect the
registration test execution.

Risk Level:
-----------
HIGH

The locator is shared by multiple page-object methods
and is involved in more than one business flow.

Recommended Regression Tests:
------------------------------
1. Run the user registration test.
2. Verify password entry during registration.
3. Verify password confirmation during registration.
4. Run login-related tests.
5. Verify password entry during login.

Potential Business Impact:
---------------------------
A broken password locator could prevent users from
completing registration or logging into the application.
`;

}

        return `
Mock AI Response

The supplied prompt was received successfully.

The AI provider is currently running in mock mode.
`;
    }

}