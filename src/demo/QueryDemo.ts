import { KnowledgeGraph } from "../graph/KnowledgeGraph";
import { QueryEngine } from "../query/QueryEngine";

export class QueryDemo {

    constructor(
        private graph: KnowledgeGraph
    ) {}

    public run(): void {

        const query = new QueryEngine(this.graph);

        console.log("");
        console.log("=================================");
        console.log("QUERY DEMO");
        console.log("=================================");

        console.log("");
        console.log("Methods in Registrationpage");

        console.log(
            query.findMethodsByPage("Registrationpage")
        );

        console.log("");
        console.log("Locators in Registrationpage");

        console.log(
            query.findLocatorsByPage("Registrationpage")
        );

        console.log("");
        console.log("Tests using txtPassword");

        console.log(
            query.findTestsUsingLocator("txtPassword")
        );

    }

}   