import "dotenv/config";

import * as readline from "readline";

import { FileScanner } from "./scanner/FileScanner";
import { PageParser } from "./parser/PageParser";
import { TestParser } from "./parser/TestParser";

import { GraphBuilder } from "./graph/GraphBuilder";
import { CrossReferenceBuilder } from "./resolver/CrossReferenceBuilder";

import { ImpactAnalyzer } from "./impact/ImpactAnalyzer";
import { StaticAnalyzer } from "./analyzer/StaticAnalyzer";
import { DependencyExplorer } from "./explorer/DependencyExplorer";
import { GraphStatistics } from "./analyzer/GraphStatistics";
import { QueryEngine } from "./query/QueryEngine";

import { ContextBuilder } from "./ai/ContextBuilder";
import { PromptBuilder } from "./ai/PromptBuilder";
import { TestContextBuilder } from "./ai/TestContextBuilder";
import { BDDContextBuilder } from "./ai/BDDContextBuilder";

import { AIService } from "./ai/services/AIService";

import { MockAIProvider } from "./ai/providers/MockAIProvider";
import { GroqAIProvider } from "./ai/providers/GroqAIProvider";

import { PageInfo } from "./model/PageInfo";
import { TestInfo } from "./model/TestInfo";

import {
    CommandRouter,
    CommandType
} from "./command/commandRouter";


// ======================================================
// MAIN
// ======================================================

async function main(): Promise<void> {


    // ==================================================
    // PROJECT PATH
    // ==================================================

    const projectPath =
        process.argv[2] ??
        "C:\\OpenCartPlaywright";


    // ==================================================
    // PROVIDER
    // ==================================================

    const providerArgument =
        process.argv.find(
            argument =>
                argument.startsWith(
                    "--provider="
                )
        );


    const providerName =
        providerArgument
            ? providerArgument
                .split("=")[1]
                .toLowerCase()
            : "mock";


    // ==================================================
    // START
    // ==================================================

    console.log("");
    console.log("==================================");
    console.log("Knowledge Graph Builder Started");
    console.log("==================================");

    console.log("");
    console.log("Project Path:");
    console.log(projectPath);


    // ==================================================
    // SCAN PROJECT
    // ==================================================

    const scanner =
        new FileScanner();


    console.log("");
    console.log("Scanning project...");


    const files =
        scanner.scan(
            projectPath
        );


    // ==================================================
    // FIND PAGE FILES
    // ==================================================

    const pageFiles =
        files.filter(
            file => {

                const lower =
                    file.toLowerCase();

                return (
                    lower.includes("\\pages\\") ||
                    lower.includes("/pages/")
                );

            }
        );


    // ==================================================
    // FIND TEST FILES
    // ==================================================

    const testFiles =
        files.filter(
            file => {

                const lower =
                    file.toLowerCase();

                return (
                    lower.includes("\\tests\\") ||
                    lower.includes("/tests/")
                );

            }
        );


    // ==================================================
    // PAGE FILES
    // ==================================================

    console.log("");
    console.log("==================================");
    console.log("Page Files");
    console.log("==================================");


    pageFiles.forEach(
        file =>
            console.log(file)
    );


    console.log("");

    console.log(
        `Total Page Files : ${pageFiles.length}`
    );


    // ==================================================
    // TEST FILES
    // ==================================================

    console.log("");
    console.log("==================================");
    console.log("Test Files");
    console.log("==================================");


    testFiles.forEach(
        file =>
            console.log(file)
    );


    console.log("");

    console.log(
        `Total Test Files : ${testFiles.length}`
    );


    // ==================================================
    // PARSE PAGE OBJECTS
    // ==================================================

    const pageParser =
        new PageParser();


    const pages:
        PageInfo[] = [];


    for (
        const file of pageFiles
    ) {

        console.log("");

        console.log(
            "Parsing Page:",
            file
        );


        const page =
            pageParser.parse(
                file
            );


        pages.push(
            page
        );

    }


    // ==================================================
    // PARSE TESTS
    // ==================================================

    const testParser =
        new TestParser();


    const tests:
        TestInfo[] = [];


    for (
        const file of testFiles
    ) {

        console.log("");

        console.log(
            "Parsing Test:",
            file
        );


        const test =
            testParser.parse(
                file
            );


        tests.push(
            test
        );


        console.log("");

        console.log(
            "Test:",
            test.testName
        );

    }


    // ==================================================
    // BUILD KNOWLEDGE GRAPH
    // ==================================================

    console.log("");
    console.log("==================================");
    console.log("Building Knowledge Graph");
    console.log("==================================");


    const graphBuilder =
        new GraphBuilder();


    const graph =
        graphBuilder.build(
            pages,
            tests
        );


    // ==================================================
    // CROSS REFERENCE
    // ==================================================

    const resolver =
        new CrossReferenceBuilder();


    resolver.build(
        graph
    );


    // ==================================================
    // STATIC ANALYSIS
    // ==================================================

    const staticAnalyzer =
        new StaticAnalyzer(
            graph
        );


    // ==================================================
    // GRAPH STATISTICS
    // ==================================================

    const graphStatistics =
        new GraphStatistics(
            graph
        );


    // ==================================================
    // DEPENDENCY EXPLORER
    // ==================================================

    const dependencyExplorer =
        new DependencyExplorer(
            graph
        );


    // ==================================================
    // QUERY ENGINE
    // ==================================================

    const queryEngine =
        new QueryEngine(
            graph
        );


    // ==================================================
    // IMPACT ANALYZER
    // ==================================================

    const impact =
        new ImpactAnalyzer(
            graph
        );


    // ==================================================
    // AI CONTEXT BUILDER
    // ==================================================

    const contextBuilder =
        new ContextBuilder(
            graph
        );


    // ==================================================
    // AI PROMPT BUILDER
    // ==================================================

    const promptBuilder =
        new PromptBuilder();


    // ==================================================
    // TEST CONTEXT BUILDER
    // ==================================================

    const testContextBuilder =
        new TestContextBuilder(
            graph
        );


    // ==================================================
    // BDD CONTEXT BUILDER
    // ==================================================

    const bddContextBuilder =
        new BDDContextBuilder(
            graph
        );


    // ==================================================
    // AI PROVIDER
    // ==================================================

    let aiProvider:
        MockAIProvider |
        GroqAIProvider;


    if (
        providerName === "groq"
    ) {

        console.log("");
        console.log(
            "AI Provider: Groq"
        );


        aiProvider =
            new GroqAIProvider();

    } else {

        console.log("");
        console.log(
            "AI Provider: Mock"
        );


        aiProvider =
            new MockAIProvider();

    }


    // ==================================================
    // AI SERVICE
    // ==================================================

    const aiService =
        new AIService(
            contextBuilder,
            promptBuilder,
            aiProvider
        );


    // ==================================================
    // COMMAND ROUTER
    // ==================================================

    const commandRouter =
        new CommandRouter();


    // ==================================================
    // CLI HEADER
    // ==================================================

    console.log("");
    console.log("==================================");
    console.log("Knowledge Graph AI");
    console.log("==================================");

    console.log("");
    console.log("Available commands:");
    console.log("");

    console.log(
        "Explain <Page.Method>"
    );

    console.log(
        "Explain test <Test Name>"
    );

    console.log(
        "Find locator <locator>"
    );

    console.log(
        "Impact <locator>"
    );

    console.log(
        "Generate BDD <Test Name>"
    );

    console.log(
        "Who calls <Method>"
    );

    console.log(
        "What tests depend on <Method>"
    );

    console.log(
        "What tests use <Locator>"
    );

    console.log(
        "Show dependency path for <Node>"
    );

    console.log("");

    console.log(
        "Type 'exit' to quit."
    );

    console.log("");


    // ==================================================
    // READLINE
    // ==================================================

    const rl =
        readline.createInterface({
            input:
                process.stdin,

            output:
                process.stdout,

            prompt:
                "> "
        });


    rl.prompt();


    // ==================================================
    // COMMAND HANDLER
    // ==================================================

    rl.on(
        "line",
        async (
            input: string
        ) => {

            const trimmed =
                input.trim();


            // ==========================================
            // EXIT
            // ==========================================

            if (
                trimmed.toLowerCase() ===
                "exit"
            ) {

                rl.close();

                return;

            }


            // ==========================================
            // EMPTY
            // ==========================================

            if (!trimmed) {

                rl.prompt();

                return;

            }


            try {

                const command =
                    commandRouter.route(
                        trimmed
                    );


                console.log("");

                console.log(
                    "Command:",
                    command
                );


                // ==================================================
                // COMMAND SWITCH
                // ==================================================

                switch (command) {


                    // ==================================================
                    // EXPLAIN TEST
                    // ==================================================

                    case CommandType.EXPLAIN_TEST: {

                        const match =
                            trimmed.match(
                                /^explain\s+test\s+(.+)$/i
                            );


                        if (!match) {

                            console.log(
                                "Please provide a test name."
                            );

                            break;

                        }


                        const testName =
                            match[1].trim();


                        const testInfo =
                            tests.find(
                                test =>
                                    test.testName
                                        .toLowerCase() ===
                                    testName
                                        .toLowerCase()
                            );


                        if (!testInfo) {

                            console.log("");

                            console.log(
                                `Test not found: ${testName}`
                            );

                            console.log("");

                            console.log(
                                "Available tests:"
                            );


                            tests.forEach(
                                test =>
                                    console.log(
                                        `- ${test.testName}`
                                    )
                            );


                            break;

                        }


                        const testContext =
                            testContextBuilder.build(
                                testInfo
                            );


                        console.log("");

                        console.log(
                            "Test Context"
                        );

                        console.log(
                            "-------------------------"
                        );


                        console.log(
                            JSON.stringify(
                                testContext,
                                null,
                                2
                            )
                        );


                        console.log("");

                        console.log(
                            "================================="
                        );

                        console.log(
                            "AI Test Explanation"
                        );

                        console.log(
                            "================================="
                        );


                        const testResponse =
                            await aiService.explainTest(
                                testContext
                            );


                        console.log("");

                        console.log(
                            "AI Test Response"
                        );

                        console.log(
                            "-------------------------"
                        );


                        console.log(
                            testResponse
                        );


                        break;

                    }


                    // ==================================================
                    // EXPLAIN METHOD
                    // ==================================================

                    case CommandType.EXPLAIN_METHOD: {

                        const match =
                            trimmed.match(
                                /^explain\s+(.+)$/i
                            );


                        if (!match) {

                            console.log(
                                "Please provide a method."
                            );

                            break;

                        }


                        const method =
                            match[1].trim();


                        if (
                            method
                                .toLowerCase()
                                .startsWith("test ")
                        ) {

                            console.log(
                                "Please use: Explain test <Test Name>"
                            );

                            break;

                        }


                        const response =
                            await aiService.explainMethod(
                                method
                            );


                        console.log("");

                        console.log(
                            "AI Response"
                        );

                        console.log(
                            "-------------------------"
                        );


                        console.log(
                            response
                        );


                        break;

                    }


                    // ==================================================
                    // FIND LOCATOR
                    // ==================================================

                    case CommandType.FIND_LOCATOR: {

                        const match =
                            trimmed.match(
                                /(?:find\s+locator|locator)\s+(.+)/i
                            );


                        if (!match) {

                            console.log(
                                "Please provide a locator."
                            );

                            break;

                        }


                        const locator =
                            match[1].trim();


                        const locatorAnalysis =
                            impact.analyzeLocator(
                                locator
                            );


                        const found =
                            locatorAnalysis
                                .affectedMethods
                                .length > 0;


                        console.log("");

                        console.log(
                            "Locator Analysis"
                        );

                        console.log(
                            "-------------------------"
                        );


                        console.log(
                            JSON.stringify(
                                {
                                    found,

                                    locator,

                                    directMethods:
                                        locatorAnalysis
                                            .directMethods,

                                    indirectMethods:
                                        locatorAnalysis
                                            .indirectMethods,

                                    affectedMethods:
                                        locatorAnalysis
                                            .affectedMethods,

                                    affectedTests:
                                        locatorAnalysis
                                            .affectedTests

                                },
                                null,
                                2
                            )
                        );


                        if (!found) {

                            console.log("");

                            console.log(
                                `Locator not found: ${locator}`
                            );

                            break;

                        }


                        const locatorContext = {

                            locator,

                            directMethods:
                                locatorAnalysis
                                    .directMethods,

                            indirectMethods:
                                locatorAnalysis
                                    .indirectMethods,

                            affectedMethods:
                                locatorAnalysis
                                    .affectedMethods,

                            affectedTests:
                                locatorAnalysis
                                    .affectedTests

                        };


                        console.log("");

                        console.log(
                            "================================="
                        );

                        console.log(
                            "AI Locator Analysis"
                        );

                        console.log(
                            "================================="
                        );


                        const locatorResponse =
                            await aiService.analyzeLocator(
                                locatorContext
                            );


                        console.log("");

                        console.log(
                            "AI Locator Response"
                        );

                        console.log(
                            "-------------------------"
                        );


                        console.log(
                            locatorResponse
                        );


                        break;

                    }


                    // ==================================================
                    // IMPACT ANALYSIS
                    // ==================================================

                    case CommandType.IMPACT_ANALYSIS: {

                        const match =
                            trimmed.match(
                                /^impact\s+(.+)$/i
                            );


                        if (!match) {

                            console.log(
                                "Please provide a locator."
                            );

                            break;

                        }


                        const locatorName =
                            match[1].trim();


                        const impactContext =
                            impact.analyzeLocator(
                                locatorName
                            );


                        console.log("");

                        console.log(
                            "================================="
                        );

                        console.log(
                            "AI Impact Analysis"
                        );

                        console.log(
                            "================================="
                        );


                        const impactResponse =
                            await aiService.analyzeImpact(
                                impactContext
                            );


                        console.log("");

                        console.log(
                            "AI Impact Response"
                        );

                        console.log(
                            "-------------------------"
                        );


                        console.log(
                            impactResponse
                        );


                        break;

                    }


                    // ==================================================
                    // GENERATE BDD
                    // ==================================================

                    case CommandType.GENERATE_BDD: {

                        const match =
                            trimmed.match(
                                /(?:generate\s+bdd|bdd)\s+(.+)/i
                            );


                        if (!match) {

                            console.log(
                                "Please provide a test name."
                            );

                            break;

                        }


                        const testName =
                            match[1].trim();


                        const testInfo =
                            tests.find(
                                test =>
                                    test.testName
                                        .toLowerCase() ===
                                    testName
                                        .toLowerCase()
                            );


                        if (!testInfo) {

                            console.log("");

                            console.log(
                                `Test not found: ${testName}`
                            );

                            console.log("");

                            console.log(
                                "Available tests:"
                            );


                            tests.forEach(
                                test =>
                                    console.log(
                                        `- ${test.testName}`
                                    )
                            );


                            break;

                        }


                        const bddContext =
                            bddContextBuilder.build(
                                testInfo
                            );


                        console.log("");

                        console.log(
                            "BDD Context"
                        );

                        console.log(
                            "-------------------------"
                        );


                        console.log(
                            JSON.stringify(
                                bddContext,
                                null,
                                2
                            )
                        );


                        // ------------------------------------------
                        // Use AIService
                        // ------------------------------------------

                        const bddResponse =
                            await aiService.generateBDD(
                                bddContext
                            );


                        console.log("");

                        console.log(
                            "BDD Response"
                        );

                        console.log(
                            "-------------------------"
                        );


                        console.log(
                            bddResponse
                        );


                        break;

                    }


                    // ==================================================
                    // FIND CALLERS
                    // ==================================================

                    case CommandType.FIND_CALLERS: {

                        const match =
                            trimmed.match(
                                /^who\s+calls\s+(.+)$/i
                            );


                        if (!match) {

                            console.log("");

                            console.log(
                                "Usage: Who calls <Method>"
                            );

                            break;

                        }


                        const method =
                            match[1].trim();


                        const callers =
                            queryEngine.findCallers(
                                method
                            );


                        console.log("");

                        console.log(
                            "================================="
                        );

                        console.log(
                            "Method Callers"
                        );

                        console.log(
                            "================================="
                        );

                        console.log("");

                        console.log(
                            "Method:"
                        );

                        console.log(
                            method
                        );

                        console.log("");

                        console.log(
                            "Called By"
                        );

                        console.log(
                            "-------------------------"
                        );


                        if (
                            callers.length === 0
                        ) {

                            console.log(
                                "No callers found."
                            );

                        } else {

                            callers.forEach(
                                caller =>
                                    console.log(
                                        caller
                                    )
                            );

                        }


                        break;

                    }


                    // ==================================================
                    // FIND TESTS
                    // ==================================================

                    case CommandType.FIND_TESTS: {

    let target = "";

    const lower =
        trimmed.toLowerCase();


    // ------------------------------------------
    // "What tests depend on <Method>?"
    // ------------------------------------------

    const dependIndex =
        lower.indexOf(
            "what tests depend on "
        );


    // ------------------------------------------
    // "What tests use <Locator>?"
    // ------------------------------------------

    const useIndex =
        lower.indexOf(
            "what tests use "
        );


    if (dependIndex === 0) {

        target =
            trimmed.substring(
                "what tests depend on ".length
            );

    } else if (useIndex === 0) {

        target =
            trimmed.substring(
                "what tests use ".length
            );

    } else {

        console.log("");

        console.log(
            "Usage:"
        );

        console.log(
            "What tests depend on <Method>"
        );

        console.log(
            "What tests use <Locator>"
        );

        break;

    }


    // ------------------------------------------
    // Remove trailing punctuation
    // ------------------------------------------

    target =
        target
            .trim()
            .replace(/[?.,!]+$/g, "")
            .trim();


    // ------------------------------------------
    // Find locator
    // ------------------------------------------

    const locatorNode =
        graph.nodes.find(
            node =>
                node.type === "Locator" &&
                node.id.toLowerCase() ===
                    target.toLowerCase()
        );


    let affectedTests:
        string[] = [];


    if (locatorNode) {

        affectedTests =
            queryEngine.findTestsUsingLocator(
                locatorNode.id
            );

    } else {

        // ------------------------------------------
        // Treat target as method
        // ------------------------------------------

        
affectedTests =
    queryEngine.findTestsDependingOnMethod(
        target
    );

    }


    // ------------------------------------------
    // Display
    // ------------------------------------------

    console.log("");

    console.log(
        "================================="
    );

    console.log(
        "Affected Tests"
    );

    console.log(
        "================================="
    );

    console.log("");

    console.log(
        "Target:"
    );

    console.log(
        target
    );

    console.log("");

    console.log(
        "Tests"
    );

    console.log(
        "-------------------------"
    );


    if (
        affectedTests.length === 0
    ) {

        console.log(
            "No tests found."
        );

    } else {

        affectedTests.forEach(
            test =>
                console.log(
                    test
                )
        );

    }


    break;

}


                    // ==================================================
                    // DEPENDENCY PATH
                    // ==================================================

                    case CommandType.DEPENDENCY_PATH: {

                        const match =
                            trimmed.match(
                                /^show\s+dependency\s+paths?\s+for\s+(.+)$/i
                            );


                        if (!match) {

                            console.log("");

                            console.log(
                                "Usage: Show dependency path for <Node>"
                            );

                            break;

                        }


                        const startNode =
                            match[1].trim();


                        const paths =
                            queryEngine.findDependencyPaths(
                                startNode
                            );


                        console.log("");

                        console.log(
                            "================================="
                        );

                        console.log(
                            "Dependency Paths"
                        );

                        console.log(
                            "================================="
                        );

                        console.log("");

                        console.log(
                            "Start Node:"
                        );

                        console.log(
                            startNode
                        );

                        console.log("");

                        if (
                            paths.length === 0
                        ) {

                            console.log(
                                "No dependency paths found."
                            );

                        } else {

                            paths.forEach(
                                (
                                    path,
                                    index
                                ) => {

                                    console.log(
                                        `${index + 1}. ${path.join(" → ")}`
                                    );

                                }
                            );

                        }


                        break;

                    }


                    // ==================================================
                    // UNKNOWN
                    // ==================================================

                    case CommandType.UNKNOWN:

                    default: {

                        console.log("");

                        console.log(
                            "Unknown command."
                        );

                        console.log("");

                        console.log(
                            "Available commands:"
                        );

                        console.log(
                            "Explain <Page.Method>"
                        );

                        console.log(
                            "Explain test <Test Name>"
                        );

                        console.log(
                            "Find locator <locator>"
                        );

                        console.log(
                            "Impact <locator>"
                        );

                        console.log(
                            "Generate BDD <Test Name>"
                        );

                        console.log(
                            "Who calls <Method>"
                        );

                        console.log(
                            "What tests depend on <Method>"
                        );

                        console.log(
                            "What tests use <Locator>"
                        );

                        console.log(
                            "Show dependency path for <Node>"
                        );


                        break;

                    }

                }

            } catch (error) {

                console.log("");

                console.log(
                    "=================================="
                );

                console.log(
                    "Command Failed"
                );

                console.log(
                    "=================================="
                );


                console.error(
                    error instanceof Error
                        ? error.message
                        : error
                );

            }


            console.log("");

            rl.prompt();

        }
    );


    // ==================================================
    // CLOSE
    // ==================================================

    rl.on(
        "close",
        () => {

            console.log("");

            console.log(
                "Knowledge Graph AI exited."
            );

        }
    );

}


// ======================================================
// START APPLICATION
// ======================================================

main()
    .catch(
        error => {

            console.error(
                "Fatal error:",
                error
            );

            process.exit(
                1
            );

        }
    );