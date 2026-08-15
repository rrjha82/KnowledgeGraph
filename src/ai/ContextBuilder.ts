import { KnowledgeGraph } from "../graph/KnowledgeGraph";

export interface AIContext {

    method: string;

    methods: string[];

    locators: string[];

}

export class ContextBuilder {

    constructor(
        private graph: KnowledgeGraph
    ) {}

    public buildMethodContext(
        method: string
    ): AIContext {

        const methods: string[] = [];
        const locators: string[] = [];

        // -----------------------------
        // Find called methods
        // -----------------------------

        this.graph.edges
            .filter(edge =>
                edge.from === method &&
                edge.relation === "calls"
            )
            .forEach(edge => {

                methods.push(edge.to);

            });

        // -----------------------------
        // Find locators used
        // -----------------------------

        this.graph.edges
            .filter(edge =>
                edge.from === method &&
                edge.relation === "uses"
            )
            .forEach(edge => {

                locators.push(edge.to);

            });

        return {

            method,

            methods,

            locators

        };

    }

}