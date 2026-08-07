import { KnowledgeGraph } from "../graph/KnowledgeGraph";

export class ImpactAnalyzer {

    constructor(private graph: KnowledgeGraph) {}

    public analyzeLocator(locator: string): void {

        console.log("");
        console.log("=================================");
        console.log("Impact Analysis");
        console.log("=================================");

        console.log("");
        console.log("Changed Locator:");
        console.log(locator);

        //-----------------------------------
        // Step 1 : Direct methods using locator
        //-----------------------------------

        const affectedMethods = new Set<string>();

        this.graph.edges
            .filter(edge =>
                edge.relation === "uses" &&
                edge.to === locator
            )
            .forEach(edge => {

                affectedMethods.add(edge.from);

            });

        //-----------------------------------
        // Step 2 : Find methods calling methods
        //-----------------------------------

        let found = true;

        while (found) {

            found = false;

            this.graph.edges
                .filter(edge => edge.relation === "calls")
                .forEach(edge => {

                    if (
                        affectedMethods.has(edge.to) &&
                        !affectedMethods.has(edge.from)
                    ) {

                        affectedMethods.add(edge.from);
                        found = true;

                    }

                });

        }

        console.log("");
        console.log("Affected Methods");
        console.log("-------------------------");

        affectedMethods.forEach(method => console.log(method));

        //-----------------------------------
        // Step 3 : Find affected tests
        //-----------------------------------

        const affectedTests = new Set<string>();

        this.graph.nodes
            .filter(node => node.type === "Test")
            .forEach(testNode => {

                const reachable = this.isTestAffected(
                    testNode.id,
                    affectedMethods
                );

                if (reachable) {
                    affectedTests.add(testNode.id);
                }

            });

        console.log("");
        console.log("Affected Tests");
        console.log("-------------------------");

        affectedTests.forEach(test => console.log(test));
    }

    //--------------------------------------------------
    // Recursive DFS
    //--------------------------------------------------

    private isTestAffected(
        currentNode: string,
        affectedMethods: Set<string>,
        visited: Set<string> = new Set()
    ): boolean {

        if (visited.has(currentNode)) {
            return false;
        }

        visited.add(currentNode);

        const outgoingCalls = this.graph.edges.filter(edge =>
            edge.from === currentNode &&
            edge.relation === "calls"
        );

        for (const edge of outgoingCalls) {

            if (affectedMethods.has(edge.to)) {
                return true;
            }

            if (
                this.isTestAffected(
                    edge.to,
                    affectedMethods,
                    visited
                )
            ) {
                return true;
            }

        }

        return false;
    }

}