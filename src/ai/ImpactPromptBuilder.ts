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
            "Analyze the locator dependency information "
            + "provided below from a Playwright Knowledge Graph.\n\n";


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
            + "behavior.\n";

        prompt +=
            "4. Do NOT assume that an affected test calls an "
            + "indirect method unless that relationship is explicitly "
            + "represented in the supplied information.\n";

        prompt +=
            "5. Do NOT construct a dependency chain by simply "
            + "combining lists. Only show a chain when the supplied "
            + "relationships support that exact chain.\n";

        prompt +=
            "6. Directly affected methods are methods explicitly "
            + "using the changed locator.\n";

        prompt +=
            "7. Indirectly affected methods are methods identified "
            + "as indirect dependencies of the directly affected "
            + "methods.\n";

        prompt +=
            "8. Affected tests are tests explicitly supplied by the "
            + "Knowledge Graph.\n";

        prompt +=
            "9. Do NOT claim that an affected test calls or depends "
            + "on a particular indirect method unless that relationship "
            + "is explicitly provided.\n";

        prompt +=
            "10. Do NOT invent additional affected tests.\n";

        prompt +=
            "11. Recommended regression testing must be limited to "
            + "the affected tests supplied by the Knowledge Graph.\n";

        prompt +=
            "12. Risk must be based ONLY on the supplied dependency "
            + "relationships and the number of affected methods/tests.\n";

        prompt +=
            "13. Do not use general Playwright knowledge to invent "
            + "application-specific behavior.\n";

        prompt +=
            "14. If information is unavailable, say exactly: "
            + "\"Not available from the provided Knowledge Graph.\"\n\n";


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
        // IMPORTANT DEPENDENCY INTERPRETATION
        // ==================================================

        prompt +=
            "\n========================================\n";

        prompt +=
            "DEPENDENCY INTERPRETATION RULES\n";

        prompt +=
            "========================================\n\n";

        prompt +=
            "The supplied lists describe categories of dependency. "
            + "They do NOT automatically establish a complete chain "
            + "between every item in the lists.\n\n";

        prompt +=
            "For example, an affected test and an indirectly affected "
            + "method may both appear in the context without the test "
            + "calling that indirect method.\n\n";

        prompt +=
            "Never combine independent dependency facts into a "
            + "relationship that was not explicitly supplied.\n\n";


        // ==================================================
        // REQUIRED RESPONSE FORMAT
        // ==================================================

        prompt +=
            "========================================\n";

        prompt +=
            "REQUIRED RESPONSE FORMAT\n";

        prompt +=
            "========================================\n\n";


        // ==================================================
        // 1. OVERALL IMPACT
        // ==================================================

        prompt +=
            "1. Overall Impact\n";

        prompt +=
            "Summarize the impact using only the supplied "
            + "dependency information.\n";

        prompt +=
            "Do not infer application behavior.\n\n";


        // ==================================================
        // 2. RISK LEVEL
        // ==================================================

        prompt +=
    "2. Risk Level\n";

prompt +=
    "Assign exactly one of: Low, Medium, or High.\n";

prompt +=
    "Base the decision ONLY on the number of affected methods, "
    + "the distinction between direct and indirect methods, and "
    + "the number of affected tests.\n";

prompt +=
    "Do not describe the risk using business importance, "
    + "criticality, authentication, financial impact, or other "
    + "domain assumptions unless explicitly provided by the "
    + "Knowledge Graph.\n\n";

prompt +=
    "Do not describe the risk using business importance, "
    + "criticality, authentication, financial impact, or other "
    + "domain assumptions unless explicitly provided by the "
    + "Knowledge Graph.\n\n";


        // ==================================================
        // 3. DIRECT METHODS
        // ==================================================

        prompt +=
            "3. Directly Affected Methods\n";

        prompt +=
            "List only the supplied directly affected methods.\n";

        prompt +=
            "Do not invent what these methods do.\n\n";


        // ==================================================
        // 4. INDIRECT METHODS
        // ==================================================

        prompt +=
            "4. Indirectly Affected Methods\n";

        prompt +=
            "List only the supplied indirectly affected methods.\n";

        prompt +=
            "State that they are indirectly affected according to "
            + "the supplied Knowledge Graph dependency information.\n";

        prompt +=
            "Do not claim that a test calls these methods unless "
            + "that relationship is explicitly provided.\n\n";


        // ==================================================
        // 5. AFFECTED TESTS
        // ==================================================

        prompt +=
            "5. Affected Tests\n";

        prompt +=
            "List only the supplied affected tests.\n";

        prompt +=
            "Do not add any other tests.\n";

        prompt +=
            "Do not claim that an affected test calls a particular "
            + "method unless that relationship is explicitly "
            + "represented in the supplied context.\n\n";


        // ==================================================
        // 6. DEPENDENCY RELATIONSHIPS
        // ==================================================

        prompt +=
            "6. Dependency Relationships\n";

        prompt +=
            "Describe only relationships that can be established "
            + "from the supplied dependency information.\n\n";

        prompt +=
            "If an exact locator-to-method-to-test chain is not "
            + "provided, do NOT create one.\n";

        prompt +=
            "Instead, describe the individual supported relationships.\n\n";


        // ==================================================
        // 7. RECOMMENDED REGRESSION TESTS
        // ==================================================

        prompt +=
            "7. Recommended Regression Tests\n";

        prompt +=
            "Recommend only the affected tests explicitly supplied "
            + "by the Knowledge Graph.\n";

        prompt +=
            "Do not create hypothetical tests.\n\n";


        // ==================================================
        // 8. POTENTIAL FUNCTIONALITY
        // ==================================================

 prompt +=
    "8. Potential Functionality Affected\n";

prompt +=
    "Only describe functionality that can be directly inferred "
    + "from method or test names.\n";

prompt +=
    "Every statement must clearly say it is an inference from "
    + "the method or test name, not a confirmed application behavior.\n";

prompt +=
    "If functionality cannot be established from the supplied "
    + "Knowledge Graph, say: "
    + "\"Not available from the provided Knowledge Graph.\"\n\n";

prompt +=
    "Every such statement must explicitly say that it is an "
    + "inference from the name.\n";

prompt +=
    "Do not classify functionality using domain terms that are "
    + "not present in the Knowledge Graph.\n\n";
        // ==================================================
        // 9. LIMITATIONS
        // ==================================================

        prompt +=
            "9. Limitations of Available Information\n";

        prompt +=
            "State what cannot be determined from the supplied "
            + "Knowledge Graph.\n\n";


        // ==================================================
        // FINAL REQUIREMENT
        // ==================================================

        prompt +=
            "FINAL REQUIREMENT:\n";

        prompt +=
            "Every factual statement must be supported by the "
            + "provided Knowledge Graph context. Do not speculate. "
            + "Do not invent application behavior. Do not construct "
            + "dependency chains by combining unrelated lists. "
            + "If information is unavailable, say exactly: "
            + "\"Not available from the provided Knowledge Graph.\"";


        return prompt;

    }

}