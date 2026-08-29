import { TestContext } from "./TestContext";


export class TestPromptBuilder {


    public buildPrompt(
        context: TestContext
    ): string {

        let prompt = "";


        // ==================================================
        // ROLE
        // ==================================================

        prompt +=
            "You are an expert Playwright Automation, "
            + "Software Testing, and Test Architecture Engineer.\n\n";


        prompt +=
            "Explain the following Playwright test using ONLY "
            + "the information supplied by the Knowledge Graph.\n\n";


        // ==================================================
        // STRICT GROUNDING RULES
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
            "4. Do not assume that a method performs an action "
            + "unless that action is supported by its name or "
            + "the supplied dependency information.\n";


        prompt +=
            "5. Do not invent method-to-locator relationships. "
            + "Use the supplied dependency mapping exactly.\n";


        prompt +=
            "6. Do not claim that a locator is used by the test "
            + "unless it appears in the supplied context.\n";


        prompt +=
            "7. Do not claim that a test calls a method unless "
            + "the method appears in the supplied methodCalls list.\n";


        prompt +=
            "8. The methodCalls order must be preserved exactly.\n";


        prompt +=
            "9. Assertions must be reported exactly as supplied. "
            + "Do not create additional expected results.\n";


        prompt +=
            "10. If information is unavailable, explicitly say: "
            + "\"Not available from the provided Knowledge Graph.\"\n";


        prompt +=
            "11. Do not use general Playwright knowledge to invent "
            + "application-specific behavior.\n\n";


        // ==================================================
        // TEST INFORMATION
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
        // IMPORTS
        // ==================================================

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


        // ==================================================
        // PAGE OBJECTS
        // ==================================================

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


        // ==================================================
        // METHOD CALLS
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
        // METHOD → LOCATOR DEPENDENCIES
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
                        `- Method: ${dependency.method}\n`;


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


        // ==================================================
        // LOCATORS
        // ==================================================

        prompt +=
            "\nAll Locators Used By The Test:\n";


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
        // DEPENDENCY FLOW
        // ==================================================

        prompt +=
            "\n========================================\n";

        prompt +=
            "DEPENDENCY FLOW\n";

        prompt +=
            "========================================\n\n";


        prompt +=
            "Explain the test using the following conceptual "
            + "dependency chain:\n\n";


        prompt +=
            "Test\n";

        prompt +=
            "  ↓\n";

        prompt +=
            "Page Objects\n";

        prompt +=
            "  ↓\n";

        prompt +=
            "Methods Called\n";

        prompt +=
            "  ↓\n";

        prompt +=
            "Method-to-Locator Dependencies\n";

        prompt +=
            "  ↓\n";

        prompt +=
            "Assertions\n\n";


        prompt +=
            "The dependency flow must be derived only from "
            + "the supplied information.\n\n";


        // ==================================================
        // REQUIRED RESPONSE
        // ==================================================

        prompt +=
            "========================================\n";

        prompt +=
            "REQUIRED RESPONSE FORMAT\n";

        prompt +=
            "========================================\n\n";


        prompt +=
            "1. Purpose of the Test\n";

        prompt +=
            "Explain the purpose using the test name and "
            + "supplied dependencies only.\n\n";


        prompt +=
            "2. Test Flow\n";

        prompt +=
            "List every method call in exactly the order "
            + "provided by the Knowledge Graph.\n\n";


        prompt +=
            "3. Page Objects Involved\n";

        prompt +=
            "List the supplied page objects and explain their "
            + "relationship to the supplied method calls.\n\n";


        prompt +=
            "4. Method-to-Locator Dependency Map\n";

        prompt +=
            "Create a clear table containing Method and Locator. "
            + "Use only the supplied mapping.\n\n";


        prompt +=
            "5. Assertions and Expected Result\n";

        prompt +=
            "Report the supplied assertions exactly. Explain "
            + "what they verify only when that meaning is directly "
            + "supported by the assertion itself.\n\n";


        prompt +=
            "6. Complete Dependency Flow\n";

        prompt +=
            "Show the test dependency chain in a readable format "
            + "using:\n";

        prompt +=
            "Test → Page Object → Method → Locator → Assertion.\n\n";


        prompt +=
            "7. Test Dependencies Summary\n";

        prompt +=
            "Summarize the methods, locators, page objects, "
            + "imports, and assertions supplied by the graph.\n\n";


        prompt +=
            "8. Limitations of Available Information\n";

        prompt +=
            "Clearly identify information that cannot be determined "
            + "from the Knowledge Graph.\n\n";


        // ==================================================
        // FINAL REQUIREMENT
        // ==================================================

        prompt +=
            "FINAL REQUIREMENT:\n";


        prompt +=
            "Every factual statement must be supported by the "
            + "provided Knowledge Graph context. Never speculate. "
            + "Never invent application behavior. When information "
            + "is missing, say: \"Not available from the provided "
            + "Knowledge Graph.\"";


        return prompt;

    }

}