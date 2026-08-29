import { LocatorContext } from "./LocatorContext";


export class LocatorPromptBuilder {

    public buildPrompt(
        context: LocatorContext
    ): string {

        let prompt = "";


        // ==================================================
        // ROLE
        // ==================================================

        prompt +=
            "You are an expert Playwright Automation "
            + "and Test Architecture Engineer.\n\n";

        prompt +=
            "Analyze the following locator using ONLY the "
            + "dependency information supplied by the "
            + "Knowledge Graph.\n\n";


        // ==================================================
        // STRICT GROUNDING RULES
        // ==================================================

        prompt +=
            "IMPORTANT GROUNDING RULES:\n";

        prompt +=
            "1. The Knowledge Graph is the single source of truth.\n";

        prompt +=
            "2. Use ONLY the supplied locator, direct methods, "
            + "indirect methods, affected methods, and affected tests.\n";

        prompt +=
            "3. Do NOT invent pages, methods, tests, locators, "
            + "URLs, business rules, validations, or application "
            + "behavior.\n";

        prompt +=
            "4. Do NOT invent indirect dependencies.\n";

        prompt +=
            "5. Do NOT claim that a test exists unless it is "
            + "explicitly listed.\n";

        prompt +=
            "6. Do NOT invent relationships between methods and "
            + "tests.\n";

        prompt +=
            "7. Recommended regression tests must be limited to "
            + "the supplied affected tests.\n";

        prompt +=
            "8. Risk must be based only on the supplied dependency "
            + "information.\n";

        prompt +=
            "9. Do not assume functionality that is not represented "
            + "in the Knowledge Graph.\n";

        prompt +=
            "10. If information is unavailable, say: "
            + "\"Not available from the provided Knowledge Graph.\"\n\n";


        // ==================================================
        // LOCATOR
        // ==================================================

        prompt +=
            "========================================\n";

        prompt +=
            "LOCATOR\n";

        prompt +=
            "========================================\n\n";

        prompt +=
            `Locator: ${context.locator}\n\n`;


        // ==================================================
        // DIRECT METHODS
        // ==================================================

        prompt +=
            "Directly Affected Methods:\n";

        if (
            context.directMethods.length === 0
        ) {

            prompt +=
                "- None\n";

        } else {

            context.directMethods.forEach(
                (method: string) => {

                    prompt +=
                        `- ${method}\n`;

                }
            );

        }


        // ==================================================
        // INDIRECT METHODS
        // ==================================================

        prompt +=
            "\nIndirectly Affected Methods:\n";

        if (
            context.indirectMethods.length === 0
        ) {

            prompt +=
                "- None\n";

        } else {

            context.indirectMethods.forEach(
                (method: string) => {

                    prompt +=
                        `- ${method}\n`;

                }
            );

        }


        // ==================================================
        // ALL AFFECTED METHODS
        // ==================================================

        prompt +=
            "\nAll Affected Methods:\n";

        if (
            context.affectedMethods.length === 0
        ) {

            prompt +=
                "- None\n";

        } else {

            context.affectedMethods.forEach(
                (method: string) => {

                    prompt +=
                        `- ${method}\n`;

                }
            );

        }


        // ==================================================
        // AFFECTED TESTS
        // ==================================================

        prompt +=
            "\nAffected Tests:\n";

        if (
            context.affectedTests.length === 0
        ) {

            prompt +=
                "- None\n";

        } else {

            context.affectedTests.forEach(
                (test: string) => {

                    prompt +=
                        `- ${test}\n`;

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
            "Changed Locator\n";

        prompt +=
            "      ↓\n";

        prompt +=
            "Directly Affected Methods\n";

        prompt +=
            "      ↓\n";

        prompt +=
            "Indirectly Affected Methods\n";

        prompt +=
            "      ↓\n";

        prompt +=
            "Affected Tests\n\n";


        // ==================================================
        // REQUIRED RESPONSE
        // ==================================================

        prompt +=
            "Provide the analysis using exactly these sections:\n\n";


        prompt +=
            "1. Locator Usage\n";

        prompt +=
            "List the directly affected methods.\n\n";


        prompt +=
            "2. Indirect Usage\n";

        prompt +=
            "List the indirectly affected methods.\n\n";


        prompt +=
            "3. Shared Locator\n";

        prompt +=
            "State whether the locator is used by multiple "
            + "direct methods. Base this only on the supplied data.\n\n";


        prompt +=
            "4. Risk Level\n";

        prompt +=
            "Assign Low, Medium, or High risk. Explain the "
            + "assessment using only the supplied dependencies.\n\n";


        prompt +=
            "5. Affected Functionality\n";

        prompt +=
            "Describe only functionality that can be directly "
            + "inferred from the supplied method and test names.\n\n";


        prompt +=
            "6. Affected Tests\n";

        prompt +=
            "List only the supplied affected tests.\n\n";


        prompt +=
            "7. Dependency Chain\n";

        prompt +=
            "Show the dependency chain in this form:\n";

        prompt +=
            "Locator → Direct Method → Indirect Method → Test\n";

        prompt +=
            "Use only relationships supported by the supplied data.\n\n";


        prompt +=
            "8. Recommended Regression Tests\n";

        prompt +=
            "Recommend only the affected tests supplied by the "
            + "Knowledge Graph.\n\n";


        prompt +=
            "9. Maintenance Considerations\n";

        prompt +=
            "Discuss maintenance implications based only on "
            + "the supplied dependency information.\n\n";


        prompt +=
            "10. Limitations\n";

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
            + "provided Knowledge Graph context. Do not speculate "
            + "or invent application behavior.";


        return prompt;

    }

}