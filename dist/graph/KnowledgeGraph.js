"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeGraph = void 0;
class KnowledgeGraph {
    nodes = [];
    edges = [];
    //-----------------------------------------
    // Add Node (No duplicates)
    //-----------------------------------------
    addNode(node) {
        const exists = this.nodes.some(n => n.id === node.id &&
            n.type === node.type);
        if (!exists) {
            this.nodes.push(node);
        }
    }
    //-----------------------------------------
    // Add Edge (No duplicates)
    //-----------------------------------------
    addEdge(edge) {
        const exists = this.edges.some(e => e.from === edge.from &&
            e.to === edge.to &&
            e.relation === edge.relation);
        if (!exists) {
            this.edges.push(edge);
        }
    }
}
exports.KnowledgeGraph = KnowledgeGraph;
