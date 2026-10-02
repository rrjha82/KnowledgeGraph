import { KnowledgeGraph } from "../graph/KnowledgeGraph";
import { ImpactContext } from "../ai/ImpactContext";

export interface ImpactAnalysisResult
    extends ImpactContext {
}


export class ImpactAnalyzer {

    constructor(
        private graph: KnowledgeGraph
    ) {}


    // ==========================================
    // Analyze locator impact
    // ==========================================

    public analyzeLocator(
        locator: string
    ): ImpactAnalysisResult {


        // ==========================================
        // Step 1
        // Find methods directly using the locator
        // ==========================================

        const directMethods =
            new Set<string>();


        this.graph.edges
            .filter(
                edge =>
                    edge.relation === "uses" &&
                    edge.to === locator
            )
            .forEach(
                edge => {

                    directMethods.add(
                        edge.from
                    );

                }
            );


        // ==========================================
        // Step 2
        // Find indirectly affected methods
        //
        // Example:
        //
        // txtPassword
        //      ↓
        // LoginPage.setPassword
        //      ↓
        // LoginPage.login
        // ==========================================

        const indirectMethods =
            new Set<string>();


        const affectedMethodSet =
            new Set<string>(
                directMethods
            );


        let found = true;


        while (found) {

            found = false;


            this.graph.edges
                .filter(
                    edge =>
                        edge.relation === "calls"
                )
                .forEach(
                    edge => {

                        const callingMethod =
                            edge.from;

                        const calledMethod =
                            edge.to;


                        if (
                            affectedMethodSet.has(
                                calledMethod
                            ) &&
                            !affectedMethodSet.has(
                                callingMethod
                            )
                        ) {

                            const sourceNode =
                                this.graph.nodes.find(
                                    node =>
                                        node.id ===
                                        callingMethod
                                );


                            // Only Methods become
                            // indirect methods.
                            //
                            // Test nodes are handled
                            // separately below.

                            if (
                                sourceNode &&
                                sourceNode.type ===
                                    "Method"
                            ) {

                                affectedMethodSet.add(
                                    callingMethod
                                );


                                indirectMethods.add(
                                    callingMethod
                                );


                                found = true;

                            }

                        }

                    }
                );

        }


        // ==========================================
        // Step 3
        // Find affected tests
        // ==========================================

        const affectedTests =
            new Set<string>();


        this.graph.nodes
            .filter(
                node =>
                    node.type === "Test"
            )
            .forEach(
                testNode => {

                    const reachable =
                        this.isTestAffected(
                            testNode.id,
                            affectedMethodSet
                        );


                    if (reachable) {

                        affectedTests.add(
                            testNode.id
                        );

                    }

                }
            );


        // ==========================================
        // Step 4
        // Return Impact Context
        // ==========================================

        return {

            locator,

            directMethods:
                Array.from(
                    directMethods
                ),

            indirectMethods:
                Array.from(
                    indirectMethods
                ),

            affectedMethods:
                Array.from(
                    affectedMethodSet
                ),

            affectedTests:
                Array.from(
                    affectedTests
                )

        };

    }


    // ==========================================
    // Check whether a test reaches an affected
    // method through the call graph
    // ==========================================

    private isTestAffected(
        currentNode: string,
        affectedMethods: Set<string>,
        visited: Set<string> = new Set<string>()
    ): boolean {


        if (
            visited.has(
                currentNode
            )
        ) {

            return false;

        }


        visited.add(
            currentNode
        );


        // ==========================================
        // Current node is already affected
        // ==========================================

        if (
            affectedMethods.has(
                currentNode
            )
        ) {

            return true;

        }


        // ==========================================
        // Find methods called by current node
        // ==========================================

        const outgoingCalls =
            this.graph.edges.filter(
                edge =>
                    edge.from ===
                        currentNode &&
                    edge.relation ===
                        "calls"
            );


        for (
            const edge of outgoingCalls
        ) {

            if (
                affectedMethods.has(
                    edge.to
                )
            ) {

                return true;

            }


            if (
                this.isTestAffected(
                    edge.to,
                    affectedMethods,
                    visited
                )
            ) {

                return true;

            }

        }


        return false;

    }

}