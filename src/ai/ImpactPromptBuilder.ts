import { ImpactContext } from "./ImpactContext";


export class ImpactPromptBuilder {

    public buildPrompt(
        context: ImpactContext
    ): string {

        let prompt = "";


        // ==================================================
        // ROLE
        // ==================================================

        prompt +=
            "You are an expert QA Automation and "
            + "Software Impact Analysis Engineer.\n\n";

        prompt +=
            "Analyze the impact of changing the following "
            + "Playwright locator using ONLY the dependency "
            + "information provided by the Knowledge Graph.\n\n";


        // ==================================================
        // STRICT GROUNDING RULES
        // ==================================================

        prompt +=
            "IMPORTANT RULES:\n";

        prompt +=
            "1. The Knowledge Graph is the single source of truth.\n";

        prompt +=
            "2. Use ONLY the locator, direct methods, indirect "
            + "methods, affected methods, and affected tests "
            + "provided below.\n";

        prompt +=
            "3. Do NOT invent pages, methods, tests, locators, "
            + "URLs, business rules, validations, or application "
            + "functionality.\n";

        prompt +=
            "4. Do NOT assume functionality that is not explicitly "
            + "represented in the dependency information.\n";

        prompt +=
            "5. Do NOT introduce hypothetical application flows.\n";

        prompt +=
            "6. Do NOT invent additional affected tests.\n";

        prompt +=
            "7. Recommended regression testing must be limited to "
            + "the affected tests supplied by the Knowledge Graph.\n";

        prompt +=
            "8. If information is unavailable, say: "
            + "\"Not available from the provided Knowledge Graph.\"\n";

        prompt +=
            "9. Risk must be based ONLY on the supplied dependency "
            + "relationships and number of affected methods/tests.\n";

        prompt +=
            "10. Do not use general Playwright knowledge to invent "
            + "application-specific behavior.\n\n";


        // ==================================================
        // CHANGED LOCATOR
        // ==================================================

        prompt +=
            "========================================\n";

        prompt +=
            "CHANGED LOCATOR\n";

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
                method => {

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
                method => {

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
                method => {

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
                test => {

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
            "Explain the impact using this dependency concept:\n\n";

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

        prompt +=
            "Use ONLY the supplied dependency information.\n\n";


        // ==================================================
        // REQUIRED RESPONSE FORMAT
        // ==================================================

        prompt +=
            "========================================\n";

        prompt +=
            "REQUIRED RESPONSE FORMAT\n";

        prompt +=
            "========================================\n\n";


        // --------------------------------------------------
        // 1. Overall Impact
        // --------------------------------------------------

        prompt +=
            "1. Overall Impact\n";

        prompt +=
            "Describe the impact of changing the locator using "
            + "only the supplied affected methods and tests.\n\n";


        // --------------------------------------------------
        // 2. Risk Level
        // --------------------------------------------------

        prompt +=
            "2. Risk Level\n";

        prompt +=
            "Assign exactly one risk level: Low, Medium, or High.\n";

        prompt +=
            "Explain the risk using only the number and dependency "
            + "relationships of the affected methods and tests.\n\n";


        // --------------------------------------------------
        // 3. Directly Affected Methods
        // --------------------------------------------------

        prompt +=
            "3. Directly Affected Methods\n";

        prompt +=
            "List and explain only the methods supplied under "
            + "Directly Affected Methods.\n\n";


        // --------------------------------------------------
        // 4. Indirectly Affected Methods
        // --------------------------------------------------

        prompt +=
            "4. Indirectly Affected Methods\n";

        prompt +=
            "List and explain only the methods supplied under "
            + "Indirectly Affected Methods.\n";

        prompt +=
            "Explain that these methods are indirectly affected "
            + "according to the dependency information supplied "
            + "by the Knowledge Graph.\n\n";


        // --------------------------------------------------
        // 5. Affected Tests
        // --------------------------------------------------

        prompt +=
            "5. Affected Tests\n";

        prompt +=
            "List only the tests supplied under Affected Tests.\n";

        prompt +=
            "Do not claim that any other tests are affected.\n\n";


        // --------------------------------------------------
        // 6. Dependency Chain
        // --------------------------------------------------

        prompt +=
            "6. Dependency Chain\n";

        prompt +=
            "Show the impact as a readable dependency chain:\n";

        prompt +=
            "Locator → Direct Method → Indirect Method → Test.\n";

        prompt +=
            "Use only relationships supported by the supplied "
            + "dependency information.\n\n";


        // --------------------------------------------------
        // 7. Recommended Regression Tests
        // --------------------------------------------------

        prompt +=
            "7. Recommended Regression Tests\n";

        prompt +=
            "Recommend regression testing only for the affected "
            + "tests explicitly supplied by the Knowledge Graph.\n";

        prompt +=
            "Do not create hypothetical tests.\n\n";


        // --------------------------------------------------
        // 8. Potential Business Functionality
        // --------------------------------------------------

        prompt +=
            "8. Potential Business Functionality Affected\n";

        prompt +=
            "Describe only functionality that can be directly "
            + "inferred from the names of the supplied methods "
            + "and tests.\n";

        prompt +=
            "Do not invent additional functionality.\n\n";


        // --------------------------------------------------
        // 9. Limitations
        // --------------------------------------------------

        prompt +=
            "9. Limitations of Available Information\n";

        prompt +=
            "Clearly state what cannot be determined from the "
            + "provided Knowledge Graph.\n\n";


        // ==================================================
        // FINAL REQUIREMENT
        // ==================================================

        prompt +=
            "FINAL REQUIREMENT:\n";

        prompt +=
            "Every factual statement must be supported by the "
            + "provided Knowledge Graph context. Do not speculate. "
            + "Do not invent application behavior. If information "
            + "is unavailable, say: \"Not available from the "
            + "provided Knowledge Graph.\"";


        return prompt;

    }

}