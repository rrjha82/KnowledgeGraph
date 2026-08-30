export enum CommandType {

    EXPLAIN_METHOD = "EXPLAIN_METHOD",

    EXPLAIN_TEST = "EXPLAIN_TEST",

    FIND_LOCATOR = "FIND_LOCATOR",

    IMPACT_ANALYSIS = "IMPACT_ANALYSIS",

    GENERATE_BDD = "GENERATE_BDD",

    FIND_CALLERS = "FIND_CALLERS",

    FIND_TESTS = "FIND_TESTS",

    DEPENDENCY_PATH = "DEPENDENCY_PATH",

    UNKNOWN = "UNKNOWN"

}


export class CommandRouter {

    public route(
        question: string
    ): CommandType {

        const text =
            question
                .trim()
                .toLowerCase();


        // ==========================================
        // EXPLAIN TEST
        // ==========================================

        if (
            /^explain\s+test\b/i.test(text)
        ) {

            return CommandType.EXPLAIN_TEST;

        }


        // ==========================================
        // EXPLAIN METHOD
        // ==========================================

        if (
            /^explain\b/i.test(text)
        ) {

            return CommandType.EXPLAIN_METHOD;

        }


        // ==========================================
        // DEPENDENCY PATH
        // ==========================================

        if (
            text.includes("dependency path") ||
            text.includes("dependency paths")
        ) {

            return CommandType.DEPENDENCY_PATH;

        }


        // ==========================================
        // FIND CALLERS
        // ==========================================

        if (
            text.includes("who calls") ||
            text.includes("callers")
        ) {

            return CommandType.FIND_CALLERS;

        }


        // ==========================================
        // FIND TESTS
        // ==========================================

        if (
            text.includes("what tests") &&
            (
                text.includes("depend") ||
                text.includes("use") ||
                text.includes("affected")
            )
        ) {

            return CommandType.FIND_TESTS;

        }


        // ==========================================
        // IMPACT ANALYSIS
        // ==========================================

        if (
            text.includes("impact")
        ) {

            return CommandType.IMPACT_ANALYSIS;

        }


        // ==========================================
        // FIND LOCATOR
        // ==========================================

        if (
            text.includes("locator")
        ) {

            return CommandType.FIND_LOCATOR;

        }


        // ==========================================
        // GENERATE BDD
        // ==========================================

        if (
            text.includes("bdd") ||
            text.includes("feature")
        ) {

            return CommandType.GENERATE_BDD;

        }


        // ==========================================
        // UNKNOWN
        // ==========================================

        return CommandType.UNKNOWN;

    }

}