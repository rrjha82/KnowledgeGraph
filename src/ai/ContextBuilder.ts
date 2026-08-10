import { KnowledgeGraph } from "../graph/KnowledgeGraph";

export class ContextBuilder {

    constructor(
        private graph: KnowledgeGraph
    ) {}

    // =====================================================
    // Build AI Context for a Method
    // =====================================================

    public buildMethodContext(methodName: string): object {

        const visited = new Set<string>();

        const methods: string[] = [];
        const locators: string[] = [];

        this.collect(methodName, visited, methods, locators);

        return {

            method: methodName,

            methods,

            locators

        };

    }

    // =====================================================
    // Recursive Graph Traversal
    // =====================================================

    private collect(

        node: string,

        visited: Set<string>,

        methods: string[],

        locators: string[]

    ): void {

        if (visited.has(node)) {

            return;

        }

        visited.add(node);

        const edges = this.graph.edges.filter(

            edge => edge.from === node

        );

        edges.forEach(edge => {

            if (edge.relation === "calls") {

                methods.push(edge.to);

                this.collect(

                    edge.to,

                    visited,

                    methods,

                    locators

                );

            }

            if (edge.relation === "uses") {

                locators.push(edge.to);

            }

        });

    }

}