"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryEngine = void 0;
class QueryEngine {
    graph;
    constructor(graph) {
        this.graph = graph;
    }
    // ----------------------------------
    // Find all methods of a page
    // ----------------------------------
    findMethodsByPage(pageName) {
        return this.graph.edges
            .filter(edge => edge.from === pageName &&
            edge.relation === "contains")
            .filter(edge => this.graph.nodes.some(node => node.id === edge.to &&
            node.type === "Method"))
            .map(edge => edge.to);
    }
    // ----------------------------------
    // Find all locators of a page
    // ----------------------------------
    findLocatorsByPage(pageName) {
        return this.graph.edges
            .filter(edge => edge.from === pageName &&
            edge.relation === "contains")
            .filter(edge => this.graph.nodes.some(node => node.id === edge.to &&
            node.type === "Locator"))
            .map(edge => edge.to);
    }
    // ----------------------------------
    // Find methods called by a test
    // ----------------------------------
    findMethodsCalledByTest(testName) {
        return this.graph.edges
            .filter(edge => edge.from === testName &&
            edge.relation === "calls")
            .map(edge => edge.to);
    }
    // ----------------------------------
    // Find locators used by a test
    // ----------------------------------
    findLocatorsUsedByTest(testName) {
        return this.graph.edges
            .filter(edge => edge.from === testName &&
            edge.relation === "indirectUses")
            .map(edge => edge.to);
    }
    // ----------------------------------
    // Find tests using a locator
    // ----------------------------------
    findTestsUsingLocator(locator) {
        return this.graph.edges
            .filter(edge => edge.to === locator &&
            edge.relation === "indirectUses")
            .map(edge => edge.from);
    }
}
exports.QueryEngine = QueryEngine;
