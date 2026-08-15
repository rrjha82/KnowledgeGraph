export enum CommandType {

    EXPLAIN_METHOD = "EXPLAIN_METHOD",

    FIND_LOCATOR = "FIND_LOCATOR",

    IMPACT_ANALYSIS = "IMPACT_ANALYSIS",

    GENERATE_BDD = "GENERATE_BDD",

    UNKNOWN = "UNKNOWN"

}

export class CommandRouter {

    public route(question: string): CommandType {

        const text = question.toLowerCase();

        if (text.includes("explain")) {
            return CommandType.EXPLAIN_METHOD;
        }

        if (text.includes("locator")) {
            return CommandType.FIND_LOCATOR;
        }

        if (text.includes("impact")) {
            return CommandType.IMPACT_ANALYSIS;
        }

        if (
            text.includes("bdd") ||
            text.includes("feature")
        ) {
            return CommandType.GENERATE_BDD;
        }

        return CommandType.UNKNOWN;

    }

}