"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphBuilder = void 0;
const KnowledgeGraph_1 = require("./KnowledgeGraph");
class GraphBuilder {
    build(pages, tests) {
        const graph = new KnowledgeGraph_1.KnowledgeGraph();
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
exports.GraphBuilder = GraphBuilder;
