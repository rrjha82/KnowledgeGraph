export enum CommandType {

    EXPLAIN_METHOD = "EXPLAIN_METHOD",

    EXPLAIN_TEST = "EXPLAIN_TEST",

    FIND_LOCATOR = "FIND_LOCATOR",

    IMPACT_ANALYSIS = "IMPACT_ANALYSIS",

    GENERATE_BDD = "GENERATE_BDD",

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
        // FIND LOCATOR
        // ==========================================

        if (
            text.includes("locator")
        ) {

            return CommandType.FIND_LOCATOR;

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