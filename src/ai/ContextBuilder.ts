import { KnowledgeGraph } from "../graph/KnowledgeGraph";
import { AIContext } from "./AIContext";



export class ContextBuilder {

    constructor(
        private graph: KnowledgeGraph
    ) {}

    public buildMethodContext(
    method: string
): AIContext {

    const methods = this.graph.edges
        .filter(edge =>
            edge.from === method &&
            edge.relation === "calls"
        )
        .map(edge => edge.to);

    const locators = this.graph.edges
        .filter(edge =>
            edge.from === method &&
            (
                edge.relation === "uses" ||
                edge.relation === "indirectUses"
            )
        )
        .map(edge => edge.to);

    return {

        method,

        methods,

        locators

    };

}
}