import { KnowledgeGraph } from "../graph/KnowledgeGraph";

export class QueryEngine {

    constructor(private graph: KnowledgeGraph) {}

    // ----------------------------------
    // Find all methods of a page
    // ----------------------------------

    public findMethodsByPage(pageName: string): string[] {

        return this.graph.edges
            .filter(edge =>
                edge.from === pageName &&
                edge.relation === "contains"
            )
            .filter(edge =>
                this.graph.nodes.some(node =>
                    node.id === edge.to &&
                    node.type === "Method"
                )
            )
            .map(edge => edge.to);

    }

    // ----------------------------------
    // Find all locators of a page
    // ----------------------------------

    public findLocatorsByPage(pageName: string): string[] {

        return this.graph.edges
            .filter(edge =>
                edge.from === pageName &&
                edge.relation === "contains"
            )
            .filter(edge =>
                this.graph.nodes.some(node =>
                    node.id === edge.to &&
                    node.type === "Locator"
                )
            )
            .map(edge => edge.to);

    }

    // ----------------------------------
    // Find methods called by a test
    // ----------------------------------

    public findMethodsCalledByTest(testName: string): string[] {

        return this.graph.edges
            .filter(edge =>
                edge.from === testName &&
                edge.relation === "calls"
            )
            .map(edge => edge.to);

    }

    // ----------------------------------
    // Find locators used by a test
    // ----------------------------------

    public findLocatorsUsedByTest(testName: string): string[] {

        return this.graph.edges
            .filter(edge =>
                edge.from === testName &&
                edge.relation === "indirectUses"
            )
            .map(edge => edge.to);

    }

    // ----------------------------------
    // Find tests using a locator
    // ----------------------------------

    public findTestsUsingLocator(locator: string): string[] {

        return this.graph.edges
            .filter(edge =>
                edge.to === locator &&
                edge.relation === "indirectUses"
            )
            .map(edge => edge.from);

    }

    public findImportsByPage(
    page: string
): string[] {

    return this.graph.edges
        .filter(edge =>
            edge.from === page &&
            edge.relation === "imports"
        )
        .map(edge => edge.to);

}

public findImportsByTest(
    test: string
): string[] {

    return this.graph.edges
        .filter(edge =>
            edge.from === test &&
            edge.relation === "imports"
        )
        .map(edge => edge.to);

}
public findLocator(locatorName: string) {

    const locator =
        this.graph.nodes.find(
            node =>
                node.type === "Locator" &&
                node.id === locatorName
        );

    if (!locator) {

        return {
            found: false,
            locator: locatorName,
            methods: [],
            tests: []
        };

    }

    const methods =
        this.graph.edges
            .filter(edge =>
                edge.to === locatorName &&
                (
                    edge.relation === "uses" ||
                    edge.relation === "indirectUses"
                )
            )
            .map(edge => edge.from)
            .filter(sourceId =>
                this.graph.nodes.some(
                    node =>
                        node.id === sourceId &&
                        node.type === "Method"
                )
            );

    const tests =
        this.graph.nodes
            .filter(node =>
                node.type === "Test"
            )
            .map(test => test.id)
            .filter(testId =>
                this.graph.edges.some(edge =>
                    edge.from === testId &&
                    edge.to === locatorName &&
                    (
                        edge.relation === "uses" ||
                        edge.relation === "indirectUses"
                    )
                )
            );

    return {
        found: true,
        locator: locatorName,
        methods,
        tests
    };
}
}

