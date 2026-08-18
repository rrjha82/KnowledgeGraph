import { KnowledgeGraph } from "./KnowledgeGraph";
import { PageInfo } from "../model/PageInfo";
import { TestInfo } from "../model/TestInfo";

export class GraphBuilder {

    public build(
        pages: PageInfo[],
        tests: TestInfo[]
    ): KnowledgeGraph {

        const graph = new KnowledgeGraph();

        // ==========================================
        // Build Page Graph
        // ==========================================

        pages.forEach(page => {

            // -------------------------------
            // Page Node
            // -------------------------------

            graph.addNode({
                id: page.pageName,
                type: "Page"
            });

            // -------------------------------
            // Locator Nodes
            // -------------------------------
            // -------------------------------
// Import Nodes
// -------------------------------

page.imports.forEach(imported => {

    graph.addNode({

        id: imported,

        type: "Import"

    });

    graph.addEdge({

        from: page.pageName,

        to: imported,

        relation: "imports"

    });

});

            page.locators.forEach(locator => {

                graph.addNode({
                    id: locator,
                    type: "Locator"
                });

                graph.addEdge({
                    from: page.pageName,
                    to: locator,
                    relation: "contains"
                });

            });

            // -------------------------------
            // Method Nodes
            // -------------------------------

            page.methods.forEach(method => {
                console.log("MethodInfo =>", method);

                graph.addNode({

                    id: method.fullName,

                    type: "Method"

                });

                graph.addEdge({

                    from: page.pageName,

                    to: method.fullName,

                    relation: "contains"

                });

                // ---------------------------
                // Method -> Locator
                // ---------------------------

                method.usesLocators.forEach(locator => {

                    graph.addEdge({

                        from: method.fullName,

                        to: locator,

                        relation: "uses"

                    });

                });

                // ---------------------------
                // Method -> Method
                // ---------------------------

                method.callsMethods.forEach(calledMethod => {

                    graph.addEdge({

                        from: method.fullName,

                        // temporarily keep short name
                        to: calledMethod,

                        relation: "calls"

                    });

                });

            });

        });

        // ==========================================
        // Build Test Graph
        // ==========================================

        tests.forEach(test => {

            graph.addNode({

                id: test.testName,

                type: "Test"

            });

            // -------------------------------
// Test Imports
// -------------------------------

test.imports.forEach(imported => {

    graph.addNode({

        id: imported,

        type: "Import"

    });

    graph.addEdge({

        from: test.testName,

        to: imported,

        relation: "imports"

    });

});

            test.methodCalls.forEach(method => {

                graph.addEdge({

                    from: test.testName,

                    // temporary
                    to: method,

                    relation: "calls"

                });

            });

            test.assertions.forEach(assertion => {

                graph.addNode({

                    id: assertion,

                    type: "Assertion"

                });

                graph.addEdge({

                    from: test.testName,

                    to: assertion,

                    relation: "asserts"

                });

            });

        });

        return graph;

    }

}