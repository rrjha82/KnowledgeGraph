import { TestContext } from "./TestContext";


export class TestPromptBuilder {


    public buildPrompt(
        context: TestContext
    ): string {

        let prompt = "";


        // ==============================================
        // Role
        // ==============================================

        prompt +=
            "You are an expert Playwright Automation "
            + "and Test Architecture Engineer.\n\n";


        prompt +=
            "Explain the following Playwright test using "
            + "ONLY the information provided by the "
            + "Knowledge Graph.\n\n";


        // ==============================================
        // Grounding Rules
        // ==============================================

        prompt +=
            "IMPORTANT RULES:\n";

        prompt +=
            "1. The Knowledge Graph is the source of truth.\n";

        prompt +=
            "2. Use ONLY the supplied test name, page objects, "
            + "methods, dependencies, locators, and assertions.\n";

        prompt +=
            "3. Do NOT invent application behavior.\n";

        prompt +=
            "4. Do NOT invent URLs, navigation, validations, "
            + "business rules, error handling, security features, "
            + "accessibility behavior, or additional tests.\n";

        prompt +=
            "5. Do NOT assume functionality that is not represented "
            + "in the supplied information.\n";

        prompt +=
            "6. Use the supplied method-to-locator dependency "
            + "mapping directly. Do NOT guess mappings.\n";

        prompt +=
            "7. Do NOT claim that a method or locator is used by "
            + "the test unless it is supplied in the context.\n";

        prompt +=
            "8. If information is unavailable, say: "
            + "\"Not available from the provided Knowledge Graph.\"\n";

        prompt +=
            "9. Do not use general Playwright knowledge to invent "
            + "application-specific behavior.\n\n";


        // ==============================================
        // Test
        // ==============================================

        prompt +=
            `Test Name: ${context.testName}\n\n`;


        // ==============================================
        // Imports
        // ==============================================

        prompt +=
            "Imports:\n";


        if (
            context.imports.length === 0
        ) {

            prompt +=
                "- None\n";

        } else {

            context.imports.forEach(
                item => {

                    prompt +=
                        `- ${item}\n`;

                }
            );

        }


        // ==============================================
        // Page Objects
        // ==============================================

        prompt +=
            "\nPage Objects:\n";


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


        // ==============================================
        // Methods
        // ==============================================

        prompt +=
            "\nMethods Called:\n";


        if (
            context.methodCalls.length === 0
        ) {

            prompt +=
                "- None\n";

        } else {

            context.methodCalls.forEach(
                method => {

                    prompt +=
                        `- ${method}\n`;

                }
            );

        }


        // ==============================================
        // Method → Locator Dependencies
        // ==============================================

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
                            "  Locators: None\n";

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


        // ==============================================
        // Locators
        // ==============================================

        prompt +=
            "\nLocators Used:\n";


        if (
            context.locators.length === 0
        ) {

            prompt +=
                "- None\n";

        } else {

            context.locators.forEach(
                locator => {

                    prompt +=
                        `- ${locator}\n`;

                }
            );

        }


        // ==============================================
        // Assertions
        // ==============================================

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


        // ==============================================
        // Analysis
        // ==============================================

        prompt +=
            "\nProvide the explanation using exactly "
            + "these sections:\n\n";


        prompt +=
            "1. Purpose of the Test\n";

        prompt +=
            "Explain the purpose based only on the test name "
            + "and supplied dependencies.\n\n";


        prompt +=
            "2. Test Flow\n";

        prompt +=
            "Describe the method calls in the exact order "
            + "provided by the Knowledge Graph.\n\n";


        prompt +=
            "3. Page Objects Involved\n";

        prompt +=
            "Explain which page objects are represented "
            + "in the test context.\n\n";


        prompt +=
            "4. Method-to-Locator Dependencies\n";

        prompt +=
            "Explain which locator is associated with each "
            + "method according to the supplied mapping.\n\n";


        prompt +=
            "5. Assertions and Expected Result\n";

        prompt +=
            "Explain only the supplied assertions. "
            + "Do not invent additional expected results.\n\n";


        prompt +=
            "6. Test Dependencies\n";

        prompt +=
            "Summarize the methods, locators, and page objects "
            + "that the test depends upon.\n\n";


        prompt +=
            "7. Limitations of Available Information\n";

        prompt +=
            "Clearly identify information that is not available "
            + "from the Knowledge Graph.\n\n";


        // ==============================================
        // Final Rule
        // ==============================================

        prompt +=
            "FINAL REQUIREMENT:\n";

        prompt +=
            "Every factual statement must be supported by "
            + "the supplied Knowledge Graph information. "
            + "Do not speculate or invent application behavior.";


        return prompt;

    }

}