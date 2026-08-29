export class PromptBuilder {


    // ==============================================
    // Method Explanation Prompt
    // ==============================================

    public buildMethodPrompt(
        context: {
            method: string;
            methods: string[];
            locators: string[];
            dependencies: {
                method: string;
                locators: string[];
            }[];
        }
    ): string {

        let prompt = "";


        prompt +=
            "You are an expert Playwright Automation "
            + "and Test Architecture Engineer.\n\n";


        prompt +=
            "Explain the following method using ONLY the "
            + "information provided by the Knowledge Graph.\n\n";


        // ==============================================
        // Grounding Rules
        // ==============================================

        prompt +=
            "IMPORTANT RULES:\n";

        prompt +=
            "1. The Knowledge Graph is the source of truth.\n";

        prompt +=
            "2. Use ONLY the method, dependencies, called "
            + "methods, and locators provided below.\n";

        prompt +=
            "3. Do NOT invent application behavior.\n";

        prompt +=
            "4. Do NOT invent validations, error handling, "
            + "navigation, URLs, business rules, security "
            + "features, accessibility behavior, or other "
            + "functionality not represented in the context.\n";

        prompt +=
            "5. Do NOT assume what a method does beyond what "
            + "can reasonably be inferred from its name and "
            + "known dependencies.\n";

        prompt +=
            "6. When a dependency explicitly maps a method "
            + "to a locator, use that mapping directly. "
            + "Do NOT guess the mapping.\n";

        prompt +=
            "7. If information is unavailable, explicitly say: "
            + "\"Not available from the provided Knowledge Graph.\"\n";

        prompt +=
            "8. Do not use general Playwright knowledge to "
            + "invent application-specific behavior.\n\n";


        // ==============================================
        // Method
        // ==============================================

        prompt +=
            `Method: ${context.method}\n\n`;


        // ==============================================
        // Dependency Chain
        // ==============================================

        prompt +=
            "Dependency Chain:\n";


        if (
            context.dependencies.length === 0
        ) {

            prompt +=
                "- No called-method dependencies found.\n";

        } else {

            context.dependencies.forEach(
                dependency => {

                    prompt +=
                        `- ${context.method} calls `
                        + `${dependency.method}\n`;

                    if (
                        dependency.locators.length === 0
                    ) {

                        prompt +=
                            "  Locators used by this method: None\n";

                    } else {

                        dependency.locators.forEach(
                            locator => {

                                prompt +=
                                    `  ${dependency.method} `
                                    + `uses ${locator}\n`;

                            }
                        );

                    }

                }
            );

        }


        // ==============================================
        // Methods
        // ==============================================

        prompt +=
            "\nMethods Called:\n";


        if (
            context.methods.length === 0
        ) {

            prompt +=
                "- None\n";

        } else {

            context.methods.forEach(
                (method: string) => {

                    prompt +=
                        `- ${method}\n`;

                }
            );

        }


        // ==============================================
        // Locators
        // ==============================================

        prompt +=
            "\nLocators Involved:\n";


        if (
            context.locators.length === 0
        ) {

            prompt +=
                "- None\n";

        } else {

            context.locators.forEach(
                (locator: string) => {

                    prompt +=
                        `- ${locator}\n`;

                }
            );

        }


        // ==============================================
        // Required Analysis
        // ==============================================

        prompt +=
            "\nProvide the explanation using exactly "
            + "these sections:\n\n";


        prompt +=
            "1. Purpose of the Method\n";

        prompt +=
            "Explain the purpose based only on the method "
            + "name and supplied dependencies.\n\n";


        prompt +=
            "2. Business Functionality\n";

        prompt +=
            "Describe only the business functionality that "
            + "can reasonably be inferred from the method "
            + "name and dependency chain.\n\n";


        prompt +=
            "3. Method Flow\n";

        prompt +=
            "Explain the sequence of called methods in the "
            + "order supplied by the Knowledge Graph.\n\n";


        prompt +=
            "4. Method-to-Locator Dependencies\n";

        prompt +=
            "For each called method, explain exactly which "
            + "locator it uses according to the supplied "
            + "dependency chain.\n";

        prompt +=
            "Do not create mappings that are not provided.\n\n";


        prompt +=
            "5. Dependencies\n";

        prompt +=
            "Explain how the method depends on its called "
            + "methods and their locators.\n\n";


        prompt +=
            "6. Limitations of Available Information\n";

        prompt +=
            "Clearly state what cannot be determined from "
            + "the Knowledge Graph.\n\n";


        // ==============================================
        // Final Grounding Requirement
        // ==============================================

        prompt +=
            "FINAL REQUIREMENT:\n";

        prompt +=
            "Every factual statement must be supported by "
            + "the supplied Knowledge Graph information. "
            + "Never speculate or invent application behavior.";


        return prompt;

    }


    // ==============================================
    // BDD Prompt
    // ==============================================

    public buildBDDPrompt(
        context: any
    ): string {

        let prompt = "";

        prompt +=
            "You are an expert Playwright BDD Automation Engineer.\n\n";

        prompt +=
            "Generate a business-readable Gherkin BDD scenario "
            + "from the following Playwright test information.\n\n";


        prompt +=
            `Test Name: ${context.testName}\n\n`;


        prompt +=
            "Page Objects:\n";

        context.pageObjects.forEach(
            (pageObject: string) => {

                prompt +=
                    `- ${pageObject}\n`;

            }
        );


        prompt += "\n";


        prompt +=
            "Methods Called:\n";

        context.methodCalls.forEach(
            (method: string) => {

                prompt +=
                    `- ${method}\n`;

            }
        );


        prompt += "\n";


        prompt +=
            "Locators Used:\n";

        context.locators.forEach(
            (locator: string) => {

                prompt +=
                    `- ${locator}\n`;

            }
        );


        prompt += "\n";


        prompt +=
            "Assertions:\n";

        context.assertions.forEach(
            (assertion: string) => {

                prompt +=
                    `- ${assertion}\n`;

            }
        );


        prompt += "\n";


        prompt += "Generate:\n";

        prompt +=
            "1. Feature name.\n";

        prompt +=
            "2. Scenario name.\n";

        prompt +=
            "3. Given steps for the initial state.\n";

        prompt +=
            "4. When steps for user actions.\n";

        prompt +=
            "5. Then steps for expected results.\n";

        prompt +=
            "6. Complete Gherkin syntax.\n\n";


        prompt +=
            "Important:\n";

        prompt +=
            "Use business-readable language rather than locator "
            + "names such as txtPassword or btnContinue.\n";

        prompt +=
            "Do not invent functionality that is not supported "
            + "by the provided test information.\n";


        return prompt;

    }

}