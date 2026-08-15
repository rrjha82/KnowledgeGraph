import { FileScanner } from "./scanner/FileScanner";
import { PageParser } from "./parser/PageParser";
import { TestParser } from "./parser/TestParser";
import { GraphBuilder } from "./graph/GraphBuilder";
import { GraphExporter } from "./explorer/GraphExporter";
import { CrossReferenceBuilder } from "./resolver/CrossReferenceBuilder";
import { QueryEngine } from "./query/QueryEngine";
import { ImpactAnalyzer } from "./impact/ImpactAnalyzer";
import { StaticAnalyzer } from "./analyzer/StaticAnalyzer";
import { DependencyExplorer } from "./explorer/DependencyExplorer";


import { ContextBuilder } from "./ai/ContextBuilder";
import { PromptBuilder } from "./ai/promptbuilder";

import { PageInfo } from "./model/PageInfo";
import { TestInfo } from "./model/TestInfo";


// ==============================
// Default Playwright Project Path
// ==============================

const projectPath =
    process.argv[2] ??
    "C:\\opencartplaywright";

console.log("Project Path:");
console.log(projectPath);

console.log("==================================");
console.log("Knowledge Graph Builder Started");
console.log("==================================");

const scanner = new FileScanner();

console.log("Scanning project...");

const files = scanner.scan(projectPath);

// -----------------------------------------
// Separate Page Files & Test Files
// -----------------------------------------

const pageFiles = files.filter(file =>
    file.toLowerCase().includes("\\pages\\") ||
    file.toLowerCase().includes("/pages/")
);

const testFiles = files.filter(file =>
    file.toLowerCase().includes("\\tests\\") ||
    file.toLowerCase().includes("/tests/")
);

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

const pageParser = new PageParser();
const pages: PageInfo[] = [];

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

const testParser = new TestParser();
const tests: TestInfo[] = [];

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

const graphBuilder = new GraphBuilder();

const graph = graphBuilder.build(
    pages,
    tests
);
const analyzer = new StaticAnalyzer(graph);

analyzer.printUnusedLocators();

const contextBuilder = new ContextBuilder(graph);

const context =
    contextBuilder.buildMethodContext(
        "Registrationpage.completeRegistration"
    );

const promptBuilder = new PromptBuilder();

const prompt =
    promptBuilder.buildMethodPrompt(context);

console.log("");

console.log("===================================");

console.log("AI Prompt");

console.log("===================================");

console.log(prompt);

// -----------------------------------------
// Resolve Cross References
// -----------------------------------------

const resolver = new CrossReferenceBuilder();

resolver.build(graph);

// -----------------------------------------
// Print Graph
// -----------------------------------------

console.log(JSON.stringify(graph, null, 2));

// -----------------------------------------
// Export Graph
// -----------------------------------------

const exporter = new GraphExporter();

exporter.export(
    graph,
    "knowledge-graph.json"
);

const query = new QueryEngine(graph);

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

const impact = new ImpactAnalyzer(graph);

impact.analyzeLocator("txtPassword");

const explorer = new DependencyExplorer(graph);
//const contextBuilder = new ContextBuilder(graph);


console.log("");
console.log("=================================");
console.log("AI Context");
console.log("=================================");
console.log("");

console.log(JSON.stringify(context, null, 2));

explorer.explain(
    "Registrationpage.completeRegistration"
);
