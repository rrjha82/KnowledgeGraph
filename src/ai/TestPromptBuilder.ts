import { TestContext } from "./TestContext";


export class TestPromptBuilder {


    // ==================================================
    // EXPLAIN TEST
    // ==================================================

    public buildPrompt(
        context: TestContext
    ): string {

        let prompt = "";


        prompt +=
            "You are an expert Playwright Automation, "
            + "Software Testing, and Test Architecture Engineer.\n\n";


        prompt +=
            "Explain the following Playwright test using ONLY "
            + "the information supplied by the Knowledge Graph.\n\n";


        // ==================================================
        // GROUNDING RULES
        // ==================================================

        prompt +=
            "IMPORTANT GROUNDING RULES:\n";

        prompt +=
            "1. The Knowledge Graph is the single source of truth.\n";

        prompt +=
            "2. Use only the supplied test name, imports, page "
            + "objects, methods, method-to-locator dependencies, "
            + "locators, and assertions.\n";

        prompt +=
            "3. Do not invent URLs, navigation, application "
            + "behavior, validations, error handling, business "
            + "rules, API calls, database operations, security "
            + "behavior, or additional tests.\n";

        prompt +=
            "4. Do not invent method-to-locator relationships.\n";

        prompt +=
            "5. Preserve the exact method call order.\n";

        prompt +=
            "6. Report assertions exactly as supplied.\n";

        prompt +=
            "7. If information is unavailable, say: "
            + "\"Not available from the provided Knowledge Graph.\"\n\n";


        // ==================================================
        // TEST INFORMATION
        // ==================================================

        prompt +=
            `Test Name: ${context.testName}\n\n`;


        prompt +=
            "Imports:\n";

        context.imports.forEach(
            item => {

                prompt +=
                    `- ${item}\n`;

            }
        );


        prompt +=
            "\nPage Objects:\n";

        context.pageObjects.forEach(
            pageObject => {

                prompt +=
                    `- ${pageObject}\n`;

            }
        );


        prompt +=
            "\nMethods Called - Exact Order:\n";

        context.methodCalls.forEach(
            (
                method,
                index
            ) => {

                prompt +=
                    `${index + 1}. ${method}\n`;

            }
        );


        prompt +=
            "\nMethod-to-Locator Dependencies:\n";

        context.dependencies.forEach(
            dependency => {

                prompt +=
                    `- Method: ${dependency.method}\n`;

                dependency.locators.forEach(
                    locator => {

                        prompt +=
                            `  Locator: ${locator}\n`;

                    }
                );

            }
        );


        prompt +=
            "\nLocators:\n";

        context.locators.forEach(
            locator => {

                prompt +=
                    `- ${locator}\n`;

            }
        );


        prompt +=
            "\nAssertions:\n";

        context.assertions.forEach(
            assertion => {

                prompt +=
                    `- ${assertion}\n`;

            }
        );


        // ==================================================
        // RESPONSE
        // ==================================================

        prompt +=
            "\nProvide exactly these sections:\n\n";

        prompt +=
            "1. Purpose of the Test\n\n";

        prompt +=
            "2. Test Flow\n\n";

        prompt +=
            "3. Page Objects Involved\n\n";

        prompt +=
            "4. Method-to-Locator Dependency Map\n\n";

        prompt +=
            "5. Assertions and Expected Result\n\n";

        prompt +=
            "6. Complete Dependency Flow\n\n";

        prompt +=
            "7. Test Dependencies Summary\n\n";

        prompt +=
            "8. Limitations of Available Information\n\n";


        prompt +=
            "FINAL REQUIREMENT:\n";

        prompt +=
            "Every factual statement must be supported by the "
            + "provided Knowledge Graph context. Never speculate.";


        return prompt;

    }


    // ==================================================
    // GENERATE BDD
    // ==================================================

    public buildBDDPrompt(
        context: TestContext
    ): string {

        let prompt = "";


        // ==================================================
        // ROLE
        // ==================================================

        prompt +=
            "You are an expert Playwright BDD Automation "
            + "and Software Testing Engineer.\n\n";


        prompt +=
            "Generate a business-readable Gherkin BDD scenario "
            + "using ONLY the information supplied by the "
            + "Knowledge Graph.\n\n";


        // ==================================================
        // STRICT GROUNDING
        // ==================================================

        prompt +=
            "IMPORTANT GROUNDING RULES:\n";

        prompt +=
            "1. The Knowledge Graph is the single source of truth.\n";

        prompt +=
            "2. Use ONLY the supplied test name, page objects, "
            + "method calls, locator dependencies, locators, "
            + "and assertions.\n";

        prompt +=
            "3. Do NOT invent URLs, pages, business rules, "
            + "validation rules, error messages, API calls, "
            + "database behavior, or application functionality.\n";

        prompt +=
            "4. Preserve the supplied method call order.\n";

        prompt +=
            "5. Use method names to describe actions only when "
            + "the action is directly supported by the method name.\n";

        prompt +=
            "6. Do NOT expose technical locator names such as "
            + "txtPassword or btnContinue in the business-readable "
            + "Gherkin unless necessary.\n";

        prompt +=
            "7. The Then step must be based only on supplied "
            + "assertions.\n";

        prompt +=
            "8. Do NOT create additional scenarios.\n";

        prompt +=
            "9. If information is unavailable, say: "
            + "\"Not available from the provided Knowledge Graph.\"\n\n";


        // ==================================================
        // TEST
        // ==================================================

        prompt +=
            "========================================\n";

        prompt +=
            "TEST INFORMATION\n";

        prompt +=
            "========================================\n\n";


        prompt +=
            `Test Name: ${context.testName}\n\n`;


        // ==================================================
        // PAGE OBJECTS
        // ==================================================

        prompt +=
            "Page Objects:\n";

        if (
            context.pageObjects.length === 0
        ) {

            prompt +=
                "- None\n";

        } else {

            context.pageObjects.forEach(
                pageObject => {

                    prompt +=
                        `- ${pageObject}\n`;

                }
            );

        }


        // ==================================================
        // METHODS
        // ==================================================

        prompt +=
            "\nMethods Called - Exact Order:\n";

        if (
            context.methodCalls.length === 0
        ) {

            prompt +=
                "- None\n";

        } else {

            context.methodCalls.forEach(
                (
                    method,
                    index
                ) => {

                    prompt +=
                        `${index + 1}. ${method}\n`;

                }
            );

        }


        // ==================================================
        // LOCATORS
        // ==================================================

        prompt +=
            "\nMethod-to-Locator Dependencies:\n";

        if (
            context.dependencies.length === 0
        ) {

            prompt +=
                "- None\n";

        } else {

            context.dependencies.forEach(
                dependency => {

                    prompt +=
                        `- ${dependency.method}\n`;

                    if (
                        dependency.locators.length === 0
                    ) {

                        prompt +=
                            "  Locator: None\n";

                    } else {

                        dependency.locators.forEach(
                            locator => {

                                prompt +=
                                    `  Locator: ${locator}\n`;

                            }
                        );

                    }

                }
            );

        }


        // ==================================================
        // ASSERTIONS
        // ==================================================

        prompt +=
            "\nAssertions:\n";

        if (
            context.assertions.length === 0
        ) {

            prompt +=
                "- None\n";

        } else {

            context.assertions.forEach(
                assertion => {

                    prompt +=
                        `- ${assertion}\n`;

                }
            );

        }


        // ==================================================
        // BDD REQUIREMENTS
        // ==================================================

        prompt +=
            "\n========================================\n";

        prompt +=
            "BDD REQUIREMENTS\n";

        prompt +=
            "========================================\n\n";


        prompt +=
            "Generate:\n";

        prompt +=
            "1. Feature name\n";

        prompt +=
            "2. Scenario name\n";

        prompt +=
            "3. Given steps representing the known initial state\n";

        prompt +=
            "4. When steps representing the supplied user actions\n";

        prompt +=
            "5. Then steps representing the supplied assertions\n";

        prompt +=
            "6. Complete valid Gherkin syntax\n\n";


        prompt +=
            "Use business-readable language.\n";

        prompt +=
            "Do not expose locator names in the Gherkin unless "
            + "the locator name itself is the only available "
            + "information.\n\n";


        // ==================================================
        // FINAL RULE
        // ==================================================

        prompt +=
            "FINAL REQUIREMENT:\n";

        prompt +=
            "Every Given, When, and Then step must be supported "
            + "by the supplied Knowledge Graph information. "
            + "Do not invent application behavior.";


        return prompt;

    }

}