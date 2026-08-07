import { KnowledgeGraph } from "../graph/KnowledgeGraph";

export class CrossReferenceBuilder {

    public build(graph: KnowledgeGraph): void {

        const newEdges = [];

        // Find all "calls" edges
        const callEdges = graph.edges.filter(
            edge => edge.relation === "calls"
        );

        for (const callEdge of callEdges) {

            // Example:
            // Registrationpage.setPassword

            const calledMethod = callEdge.to;

            // Find all locators used by this FULL method name
            const locatorEdges = graph.edges.filter(edge =>

                edge.relation === "uses" &&
                edge.from === calledMethod

            );

            for (const locatorEdge of locatorEdges) {

                // Avoid duplicate edges
                const exists = graph.edges.some(edge =>

                    edge.from === callEdge.from &&
                    edge.to === locatorEdge.to &&
                    edge.relation === "indirectUses"

                );

                if (!exists) {

                    newEdges.push({

                        from: callEdge.from,

                        to: locatorEdge.to,

                        relation: "indirectUses"

                    });

                }

            }

        }

        graph.edges.push(...newEdges);

    }

}