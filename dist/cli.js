"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileScanner_1 = require("./scanner/FileScanner");
const PageParser_1 = require("./parser/PageParser");
const TestParser_1 = require("./parser/TestParser");
const GraphBuilder_1 = require("./graph/GraphBuilder");
const GraphExporter_1 = require("./exporter/GraphExporter");
const CrossReferenceBuilder_1 = require("./resolver/CrossReferenceBuilder");
const QueryEngine_1 = require("./query/QueryEngine");
const ImpactAnalyzer_1 = require("./impact/ImpactAnalyzer");
const StaticAnalyzer_1 = require("./analyzer/StaticAnalyzer");
// ==============================
// Default Playwright Project Path
// ==============================
const projectPath = process.argv[2] ??
    "C:\\opencartplaywright";
console.log("Project Path:");
console.log(projectPath);
console.log("==================================");
console.log("Knowledge Graph Builder Started");
console.log("==================================");
const scanner = new FileScanner_1.FileScanner();
console.log("Scanning project...");
const files = scanner.scan(projectPath);
// -----------------------------------------
// Separate Page Files & Test Files
// -----------------------------------------
const pageFiles = files.filter(file => file.toLowerCase().includes("\\pages\\") ||
    file.toLowerCase().includes("/pages/"));
const testFiles = files.filter(file => file.toLowerCase().includes("\\tests\\") ||
    file.toLowerCase().includes("/tests/"));
console.log("");
console.log("Page Files");
console.log("--------------------------------");
pageFiles.forEach(file => console.log(file));
console.log("");
console.log("Test Files");
console.log("--------------------------------");
testFiles.forEach(file => console.log(file));
console.log("");
console.log(`Total Page Files : ${pageFiles.length}`);
console.log(`Total Test Files : ${testFiles.length}`);
// -----------------------------------------
// Parse Page Objects
// -----------------------------------------
const pageParser = new PageParser_1.PageParser();
const pages = [];
for (const file of pageFiles) {
    console.log("");
    console.log("Parsing:", file);
    const page = pageParser.parse(file);
    pages.push(page);
    console.log(JSON.stringify(page, null, 2));
}
// -----------------------------------------
// Parse Test Files
// -----------------------------------------
const testParser = new TestParser_1.TestParser();
const tests = [];
for (const file of testFiles) {
    console.log("");
    console.log("Parsing:", file);
    const test = testParser.parse(file);
    tests.push(test);
    console.log(JSON.stringify(test, null, 2));
}
// -----------------------------------------
// Build Graph
// -----------------------------------------
console.log("");
console.log("==================================");
console.log("Building Knowledge Graph");
console.log("==================================");
const graphBuilder = new GraphBuilder_1.GraphBuilder();
const graph = graphBuilder.build(pages, tests);
const analyzer = new StaticAnalyzer_1.StaticAnalyzer(graph);
analyzer.printUnusedLocators();
// -----------------------------------------
// Resolve Cross References
// -----------------------------------------
const resolver = new CrossReferenceBuilder_1.CrossReferenceBuilder();
resolver.build(graph);
// -----------------------------------------
// Print Graph
// -----------------------------------------
console.log(JSON.stringify(graph, null, 2));
// -----------------------------------------
// Export Graph
// -----------------------------------------
const exporter = new GraphExporter_1.GraphExporter();
exporter.export(graph, "knowledge-graph.json");
const query = new QueryEngine_1.QueryEngine(graph);
console.log("\n==============================");
console.log("Knowledge Graph Queries");
console.log("==============================");
console.log("\nMethods in Registrationpage:");
console.log(query.findMethodsByPage("Registrationpage"));
console.log("\nLocators in Registrationpage:");
console.log(query.findLocatorsByPage("Registrationpage"));
console.log("\nMethods called by user registration test:");
console.log(query.findMethodsCalledByTest("user registration test"));
console.log("\nLocators used by user registration test:");
console.log(query.findLocatorsUsedByTest("user registration test"));
console.log("\nTests using txtPassword:");
console.log(query.findTestsUsingLocator("txtPassword"));
const impact = new ImpactAnalyzer_1.ImpactAnalyzer(graph);
impact.analyzeLocator("txtPassword");
