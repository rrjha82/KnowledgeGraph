import { ImpactContext } from "./ImpactContext";

export class ImpactPromptBuilder {

    public buildPrompt(
        context: ImpactContext
    ): string {

        let prompt = "";

        prompt +=
            "You are an expert QA Automation and "
            + "Software Impact Analysis Engineer.\n\n";

        prompt +=
            "Analyze the impact of changing the following "
            + "Playwright locator using ONLY the dependency "
            + "information provided by the Knowledge Graph.\n\n";


        // ==============================================
        // STRICT GROUNDING RULES
        // ==============================================

        prompt +=
            "IMPORTANT RULES:\n";

        prompt +=
            "1. The Knowledge Graph is the source of truth.\n";

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
            + "represented in the provided dependency information.\n";

        prompt +=
            "5. Do NOT introduce hypothetical application flows.\n";

        prompt +=
            "6. Clearly distinguish DIRECT locator dependencies "
            + "from INDIRECT or TRANSITIVE dependencies.\n";

        prompt +=
            "7. A method listed under Directly Affected Methods "
            + "must be described as directly using the locator.\n";

        prompt +=
            "8. A method listed under Indirectly Affected Methods "
            + "must be described as affected through another method "
            + "dependency. Do NOT call it direct locator usage.\n";

        prompt +=
            "9. Do NOT use words such as 'likely', 'probably', "
            + "or 'may call' when the dependency relationship is "
            + "explicitly supplied by the Knowledge Graph.\n";

        prompt +=
            "10. Recommended regression tests must be based ONLY "
            + "on the affected tests provided in the context.\n";

        prompt +=
            "11. Do NOT recommend tests for functionality that is "
            + "not represented in the Knowledge Graph.\n";

        prompt +=
            "12. If information is unavailable, say: "
            + "\"Not available from the provided Knowledge Graph.\"\n";

        prompt +=
            "13. Base the risk level ONLY on the supplied dependency "
            + "relationships.\n";

        prompt +=
            "14. Do not use general Playwright knowledge to invent "
            + "application behavior.\n\n";


        // ==============================================
        // CHANGED LOCATOR
        // ==============================================

        prompt +=
            `Changed Locator: ${context.locator}\n\n`;


        // ==============================================
        // DIRECT METHODS
        // ==============================================

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


        // ==============================================
        // INDIRECT METHODS
        // ==============================================

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


        // ==============================================
        // ALL AFFECTED METHODS
        // ==============================================

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


        // ==============================================
        // AFFECTED TESTS
        // ==============================================

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


        // ==============================================
        // ANALYSIS
        // ==============================================

        prompt +=
            "\nProvide the analysis using exactly these sections:\n\n";


        prompt +=
            "1. Overall Impact\n";

        prompt +=
            "Summarize the impact using only the supplied "
            + "dependency information.\n\n";


        prompt +=
            "2. Risk Level\n";

        prompt +=
            "Assign Low, Medium, or High risk.\n";

        prompt +=
            "Explain the risk only using the supplied direct "
            + "and indirect dependencies and affected tests.\n\n";


        prompt +=
            "3. Directly Affected Methods\n";

        prompt +=
            "List and explain only the methods supplied under "
            + "Directly Affected Methods.\n";

        prompt +=
            "These methods directly use the changed locator.\n\n";


        prompt +=
            "4. Indirectly Affected Methods\n";

        prompt +=
            "List and explain only the methods supplied under "
            + "Indirectly Affected Methods.\n";

        prompt +=
            "Explain that they are affected through the dependency "
            + "chain represented in the Knowledge Graph.\n\n";


        prompt +=
            "5. Why These Tests Are Affected\n";

        prompt +=
            "Explain why each supplied test is affected based "
            + "only on the provided dependency information.\n\n";


        prompt +=
            "6. Recommended Regression Tests\n";

        prompt +=
            "Recommend only the affected tests explicitly listed "
            + "in the Knowledge Graph.\n";

        prompt +=
            "Do not create hypothetical tests.\n\n";


        prompt +=
            "7. Potential Business Functionality Affected\n";

        prompt +=
            "Describe only business functionality directly "
            + "supported by the names and relationships of the "
            + "supplied methods and tests.\n";

        prompt +=
            "Do not infer additional features.\n\n";


        // ==============================================
        // FINAL REQUIREMENT
        // ==============================================

        prompt +=
            "FINAL REQUIREMENT:\n";

        prompt +=
            "Every statement must be supported by the supplied "
            + "Knowledge Graph information. Never replace an "
            + "explicit dependency relationship with a guess. "
            + "If the Knowledge Graph does not provide enough "
            + "information, state that explicitly.";

        return prompt;

    }

}