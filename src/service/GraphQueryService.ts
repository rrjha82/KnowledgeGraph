import { KnowledgeGraph } from "../graph/KnowledgeGraph";

export class GraphQueryService {

    constructor(
        private graph: KnowledgeGraph
    ) {}

    // =====================================================
    // Methods inside a Page
    // =====================================================

    public getMethodsByPage(page: string): string[] {

        return this.graph.edges
            .filter(edge =>
                edge.from === page &&
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

    // =====================================================
    // Locators inside a Page
    // =====================================================

    public getLocatorsByPage(page: string): string[] {

        return this.graph.edges
            .filter(edge =>
                edge.from === page &&
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

    // =====================================================
    // Methods called by a Method/Test
    // =====================================================

    public getCalledMethods(node: string): string[] {

        return this.graph.edges
            .filter(edge =>
                edge.from === node &&
                edge.relation === "calls"
            )
            .map(edge => edge.to);

    }

    // =====================================================
    // Locators used by a Method
    // =====================================================

    public getUsedLocators(method: string): string[] {

        return this.graph.edges
            .filter(edge =>
                edge.from === method &&
                edge.relation === "uses"
            )
            .map(edge => edge.to);

    }

    // =====================================================
    // Tests calling a Method
    // =====================================================

    public getTestsCallingMethod(method: string): string[] {

        return this.graph.edges
            .filter(edge =>
                edge.relation === "calls" &&
                edge.to === method
            )
            .filter(edge =>
                this.graph.nodes.some(node =>
                    node.id === edge.from &&
                    node.type === "Test"
                )
            )
            .map(edge => edge.from);

    }

}