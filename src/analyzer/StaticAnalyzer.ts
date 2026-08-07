import { KnowledgeGraph } from "../graph/KnowledgeGraph";

export class StaticAnalyzer {

    constructor(private graph: KnowledgeGraph) {}

    public findUnusedLocators(): string[] {

        const locators = this.graph.nodes
            .filter(node => node.type === "Locator")
            .map(node => node.id);

        const usedLocators = new Set(

            this.graph.edges
                .filter(edge => edge.relation === "uses")
                .map(edge => edge.to)

        );

        return locators.filter(locator => !usedLocators.has(locator));
    }

    public printUnusedLocators(): void {

        const unused = this.findUnusedLocators();

        console.log("");
        console.log("=================================");
        console.log("Unused Locators");
        console.log("=================================");

        if (unused.length === 0) {

            console.log("No unused locators found.");
            return;
        }

        unused.forEach(locator => console.log(locator));
    }

}