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
import { GraphStatistics } from "./analyzer/GraphStatistics";

import { ContextBuilder } from "./ai/ContextBuilder";
import { PromptBuilder } from "./ai/PromptBuilder";

import { PageInfo } from "./model/PageInfo";
import { TestInfo } from "./model/TestInfo";

// ======================================================
// Playwright Project Path
// ======================================================

const projectPath =
    process.argv[2] ??
    "C:\\opencartplaywright";

console.log("");
console.log("==================================");
console.log("Knowledge Graph Builder Started");
console.log("==================================");

console.log("");
console.log("Project Path:");
console.log(projectPath);

// ======================================================
// Scan Project
// ======================================================

const scanner = new FileScanner();

console.log("");
console.log("Scanning project...");

const files = scanner.scan(projectPath);

// ======================================================
// Separate Page Files and Test Files
// ======================================================

const pageFiles = files.filter(file =>
    file.toLowerCase().includes("\\pages\\") ||
    file.toLowerCase().includes("/pages/")
);

const testFiles = files.filter(file =>
    file.toLowerCase().includes("\\tests\\") ||
    file.toLowerCase().includes("/tests/")
);

console.log("");
console.log("==================================");
console.log("Page Files");
console.log("==================================");

pageFiles.forEach(file =>
    console.log(file)
);

console.log("");
console.log("==================================");
console.log("Test Files");
console.log("==================================");

testFiles.forEach(file =>
    console.log(file)
);

console.log("");
console.log(`Total Page Files : ${pageFiles.length}`);
console.log(`Total Test Files : ${testFiles.length}`);

// ======================================================
// Parse Page Objects
// ======================================================

console.log("");
console.log("==================================");
console.log("Parsing Page Objects");
console.log("==================================");

const pageParser = new PageParser();

const pages: PageInfo[] = [];

for (const file of pageFiles) {

    console.log("");
    console.log("Parsing Page:", file);

    const page = pageParser.parse(file);

    pages.push(page);

}

// ======================================================
// Parse Test Files
// ======================================================

console.log("");
console.log("==================================");
console.log("Parsing Test Files");
console.log("==================================");

const testParser = new TestParser();

const tests: TestInfo[] = [];

for (const file of testFiles) {

    console.log("");
    console.log("Parsing Test:", file);

    const test = testParser.parse(file);

    tests.push(test);

}

// ======================================================
// Build Knowledge Graph
// ======================================================

console.log("");
console.log("==================================");
console.log("Building Knowledge Graph");
console.log("==================================");

const graphBuilder = new GraphBuilder();

const graph = graphBuilder.build(
    pages,
    tests
);

// ======================================================
// Resolve Cross References
//
// IMPORTANT:
// This must happen BEFORE ContextBuilder.
// CrossReferenceBuilder creates indirectUses edges.
// ======================================================

console.log("");
console.log("==================================");
console.log("Resolving Cross References");
console.log("==================================");

const resolver = new CrossReferenceBuilder();

resolver.build(graph);

// ======================================================
// Static Analysis
// ======================================================

console.log("");
console.log("==================================");
console.log("Static Analysis");
console.log("==================================");

const analyzer = new StaticAnalyzer(graph);

analyzer.printUnusedLocators();

// ======================================================
// Dependency Explorer
// ======================================================

console.log("");
console.log("==================================");
console.log("Dependency Explorer");
console.log("==================================");

const explorer = new DependencyExplorer(graph);

explorer.explain(
    "Registrationpage.completeRegistration"
);

// ======================================================
// AI Context
//
// IMPORTANT:
// This is AFTER CrossReferenceBuilder.
// Therefore indirectUses relationships are available.
// ======================================================

console.log("");
console.log("==================================");
console.log("AI Context");
console.log("==================================");

const contextBuilder = new ContextBuilder(graph);

const context =
    contextBuilder.buildMethodContext(
        "Registrationpage.completeRegistration"
    );

console.log("");

console.log(
    JSON.stringify(
        context,
        null,
        2
    )
);

// ======================================================
// AI Prompt
// ======================================================

console.log("");
console.log("==================================");
console.log("AI Prompt");
console.log("==================================");

const promptBuilder = new PromptBuilder();

const prompt =
    promptBuilder.buildMethodPrompt(
        context
    );

console.log("");
console.log(prompt);

// ======================================================
// Knowledge Graph Queries
// ======================================================

console.log("");
console.log("==================================");
console.log("Knowledge Graph Queries");
console.log("==================================");

const query = new QueryEngine(graph);

console.log("");
console.log("Methods in Registrationpage:");

console.log(
    query.findMethodsByPage(
        "Registrationpage"
    )
);

console.log("");
console.log("Locators in Registrationpage:");

console.log(
    query.findLocatorsByPage(
        "Registrationpage"
    )
);

console.log("");
console.log("Methods called by user registration test:");

console.log(
    query.findMethodsCalledByTest(
        "user registration test"
    )
);

console.log("");
console.log("Locators used by user registration test:");

console.log(
    query.findLocatorsUsedByTest(
        "user registration test"
    )
);

console.log("");
console.log("Tests using txtPassword:");

console.log(
    query.findTestsUsingLocator(
        "txtPassword"
    )
);

// ======================================================
// Impact Analysis
// ======================================================

console.log("");
console.log("==================================");
console.log("Impact Analysis");
console.log("==================================");

const impact = new ImpactAnalyzer(graph);

impact.analyzeLocator(
    "txtPassword"
);

// ======================================================
// Import Graph
// ======================================================

console.log("");
console.log("=================================");
console.log("IMPORT GRAPH");
console.log("=================================");

pages.forEach(page => {

    console.log("");
    console.log(page.pageName);

    console.log(
        page.imports
    );

});

// ======================================================
// Graph Statistics
// ======================================================

const statistics =
    new GraphStatistics(graph);

statistics.print();

// ======================================================
// Print Complete Graph
// ======================================================

console.log("");
console.log("==================================");
console.log("Knowledge Graph");
console.log("==================================");

console.log(
    JSON.stringify(
        graph,
        null,
        2
    )
);

// ======================================================
// Export Knowledge Graph
// ======================================================

console.log("");
console.log("==================================");
console.log("Exporting Knowledge Graph");
console.log("==================================");

const exporter =
    new GraphExporter();

exporter.export(
    graph,
    "knowledge-graph.json"
);

console.log("");
console.log("==================================");
console.log("Knowledge Graph Builder Completed");
console.log("==================================");