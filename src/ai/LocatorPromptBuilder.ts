import { LocatorContext } from "./LocatorContext";

export class LocatorPromptBuilder {

    public buildPrompt(
        context: LocatorContext
    ): string {

        let prompt = "";

        prompt +=
            "You are an expert Playwright Automation "
            + "and Test Architecture Engineer.\n\n";

        prompt +=
            "Analyze ONLY the locator dependency information "
            + "provided below from a Playwright Knowledge Graph.\n\n";


        // ==============================================
        // STRICT GROUNDING RULES
        // ==============================================

        prompt +=
            "IMPORTANT RULES:\n";

        prompt +=
            "1. Use ONLY the information provided in this context.\n";

        prompt +=
            "2. Do NOT invent pages, methods, tests, locators, "
            + "URLs, business functionality, validations, or "
            + "application behavior.\n";

        prompt +=
            "3. Do NOT assume functionality that is not explicitly "
            + "represented in the provided dependency information.\n";

        prompt +=
            "4. Clearly distinguish direct locator usage from "
            + "indirect or transitive method usage when possible.\n";

        prompt +=
            "5. Do NOT claim that a test exists unless it is listed "
            + "in the provided test information.\n";

        prompt +=
            "6. Recommended regression tests must be limited to "
            + "the affected tests explicitly provided in this context.\n";

        prompt +=
            "7. Do NOT recommend unrelated functionality such as "
            + "password reset, forgot password, accessibility, "
            + "2FA, password strength, or other features unless "
            + "they are explicitly present in the context.\n";

        prompt +=
            "8. If information is not available, say: "
            + "\"Not available from the provided Knowledge Graph.\"\n";

        prompt +=
            "9. Base the risk assessment ONLY on the dependency "
            + "relationships and tests provided below.\n";

        prompt +=
            "10. Do not generate hypothetical application behavior.\n\n";


        // ==============================================
        // LOCATOR
        // ==============================================

        prompt +=
            `Locator: ${context.locator}\n\n`;


        // ==============================================
        // METHODS
        // ==============================================

        prompt +=
            "Methods associated with this locator:\n";

        if (context.methods.length === 0) {

            prompt +=
                "- None\n";

        } else {

            context.methods.forEach(
                method => {

                    prompt +=
                        `- ${method}\n`;

                }
            );

        }


        // ==============================================
        // TESTS
        // ==============================================

        prompt +=
            "\nTests associated with this locator:\n";

        if (context.tests.length === 0) {

            prompt +=
                "- None\n";

        } else {

            context.tests.forEach(
                test => {

                    prompt +=
                        `- ${test}\n`;

                }
            );

        }


        // ==============================================
        // ANALYSIS
        // ==============================================

        prompt +=
            "\nProvide the analysis using exactly these sections:\n\n";


        prompt +=
            "1. Locator Usage\n";

        prompt +=
            "Explain where the locator is used based only on "
            + "the supplied methods and tests.\n\n";


        prompt +=
            "2. Shared Locator\n";

        prompt +=
            "State whether the locator is shared across multiple "
            + "methods or page objects based only on the supplied "
            + "information.\n\n";


        prompt +=
            "3. Risk Level\n";

        prompt +=
            "Assign Low, Medium, or High risk.\n";

        prompt +=
            "Explain the risk using ONLY the number and nature "
            + "of the supplied dependencies.\n\n";


        prompt +=
            "4. Affected Functionality\n";

        prompt +=
            "Describe ONLY the functionality represented by the "
            + "listed methods and tests.\n";

        prompt +=
            "Do not introduce any functionality that is not listed.\n\n";


        prompt +=
            "5. Recommended Regression Tests\n";

        prompt +=
            "Recommend regression testing only for the affected "
            + "tests explicitly listed in the context.\n";

        prompt +=
            "Do not create hypothetical tests for functionality "
            + "that is not represented in the Knowledge Graph.\n\n";


        prompt +=
            "6. Maintenance Considerations\n";

        prompt +=
            "Discuss maintenance implications based only on the "
            + "provided dependency information.\n\n";


        // ==============================================
        // FINAL REQUIREMENT
        // ==============================================

        prompt +=
            "FINAL REQUIREMENT:\n";

        prompt +=
            "The Knowledge Graph is the source of truth. "
            + "If a statement cannot be supported by the supplied "
            + "locator, methods, and tests, do not make that statement.";

        return prompt;
    }
}