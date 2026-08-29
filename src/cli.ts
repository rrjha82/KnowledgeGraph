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
                // EXPLAIN TEST
                // ==================================================

                switch (command) {


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


                        // ------------------------------------------
                        // Build Test Context
                        // ------------------------------------------

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


                        // ------------------------------------------
                        // AI Explanation
                        // ------------------------------------------

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


                        // ------------------------------------------
                        // Avoid treating "explain test" as method
                        // ------------------------------------------

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


                        // ------------------------------------------
                        // Use Impact Analyzer as single source
                        // for locator dependency traversal
                        // ------------------------------------------

                        const locatorAnalysis =
                            impact.analyzeLocator(
                                locator
                            );


                        // ------------------------------------------
                        // Check locator
                        // ------------------------------------------

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


                        // ------------------------------------------
                        // Build NEW LocatorContext
                        // ------------------------------------------

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


                        // ------------------------------------------
                        // AI Locator Analysis
                        // ------------------------------------------

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


                        // ------------------------------------------
                        // Graph Impact Analysis
                        // ------------------------------------------

                        const impactContext =
                            impact.analyzeLocator(
                                locatorName
                            );


                        // ------------------------------------------
                        // AI Impact Analysis
                        // ------------------------------------------

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


                        // ------------------------------------------
                        // Build BDD Context
                        // ------------------------------------------

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
                        // BDD Prompt
                        // ------------------------------------------

                        let bddPrompt =
                            "";


                        bddPrompt +=
                            "You are an expert Playwright "
                            + "BDD Automation Engineer.\n\n";


                        bddPrompt +=
                            "Generate a business-readable "
                            + "Gherkin BDD scenario from the "
                            + "following Playwright test "
                            + "information.\n\n";


                        bddPrompt +=
                            `Test Name: ${bddContext.testName}\n\n`;


                        bddPrompt +=
                            "Page Objects:\n";


                        bddContext.pageObjects.forEach(
                            pageObject => {

                                bddPrompt +=
                                    `- ${pageObject}\n`;

                            }
                        );


                        bddPrompt +=
                            "\nMethods Called:\n";


                        bddContext.methodCalls.forEach(
                            methodCall => {

                                bddPrompt +=
                                    `- ${methodCall}\n`;

                            }
                        );


                        bddPrompt +=
                            "\nLocators Used:\n";


                        bddContext.locators.forEach(
                            locatorName => {

                                bddPrompt +=
                                    `- ${locatorName}\n`;

                            }
                        );


                        bddPrompt +=
                            "\nAssertions:\n";


                        bddContext.assertions.forEach(
                            assertion => {

                                bddPrompt +=
                                    `- ${assertion}\n`;

                            }
                        );


                        bddPrompt +=
                            "\nGenerate:\n";

                        bddPrompt +=
                            "1. Feature name.\n";

                        bddPrompt +=
                            "2. Scenario name.\n";

                        bddPrompt +=
                            "3. Given steps for the initial state.\n";

                        bddPrompt +=
                            "4. When steps for user actions.\n";

                        bddPrompt +=
                            "5. Then steps for expected results.\n";

                        bddPrompt +=
                            "6. Complete Gherkin syntax.\n";


                        bddPrompt +=
                            "\nImportant:\n";


                        bddPrompt +=
                            "Use business-readable language "
                            + "rather than locator names such "
                            + "as txtPassword or btnContinue.\n";


                        bddPrompt +=
                            "Do not invent functionality that "
                            + "is not supported by the provided "
                            + "test information.";


                        // ------------------------------------------
                        // AI BDD Response
                        // ------------------------------------------

                        const bddResponse =
                            await aiService.ask(
                                bddPrompt
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