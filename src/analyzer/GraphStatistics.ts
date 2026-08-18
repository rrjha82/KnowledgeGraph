import { KnowledgeGraph } from "../graph/KnowledgeGraph";

export class GraphStatistics {

    constructor(
        private graph: KnowledgeGraph
    ) {}

    public print(): void {

        console.log("");
        console.log("=================================");
        console.log("Knowledge Graph Statistics");
        console.log("=================================");

        const nodeTypes = new Map<string, number>();
        const edgeTypes = new Map<string, number>();

        // Count Nodes
        this.graph.nodes.forEach(node => {

            nodeTypes.set(
                node.type,
                (nodeTypes.get(node.type) ?? 0) + 1
            );

        });

        // Count Edges
        this.graph.edges.forEach(edge => {

            edgeTypes.set(
                edge.relation,
                (edgeTypes.get(edge.relation) ?? 0) + 1
            );

        });

        console.log("");
        console.log("Nodes");
        console.log("-------------------------");

        nodeTypes.forEach((count, type) => {

            console.log(`${type}: ${count}`);

        });

        console.log("");
        console.log("Edges");
        console.log("-------------------------");

        edgeTypes.forEach((count, relation) => {

            console.log(`${relation}: ${count}`);

        });

        console.log("");
        console.log(`Total Nodes : ${this.graph.nodes.length}`);
        console.log(`Total Edges : ${this.graph.edges.length}`);

    }

}