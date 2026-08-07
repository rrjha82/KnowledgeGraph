import { GraphNode } from "../model/GraphNode";
import { GraphEdge } from "../model/GraphEdge";

export class KnowledgeGraph {

    nodes: GraphNode[] = [];

    edges: GraphEdge[] = [];

    //-----------------------------------------
    // Add Node (No duplicates)
    //-----------------------------------------

    public addNode(node: GraphNode): void {

        const exists = this.nodes.some(n =>
            n.id === node.id &&
            n.type === node.type
        );

        if (!exists) {
            this.nodes.push(node);
        }

    }

    //-----------------------------------------
    // Add Edge (No duplicates)
    //-----------------------------------------

    public addEdge(edge: GraphEdge): void {

        const exists = this.edges.some(e =>

            e.from === edge.from &&
            e.to === edge.to &&
            e.relation === edge.relation

        );

        if (!exists) {
            this.edges.push(edge);
        }

    }

}