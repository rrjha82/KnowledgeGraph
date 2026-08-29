import { KnowledgeGraph } from "../graph/KnowledgeGraph";
import {
    AIContext,
    MethodDependency
} from "./AIContext";


export class ContextBuilder {

    constructor(
        private graph: KnowledgeGraph
    ) {}


    // ==============================================
    // Build Method Context
    // ==============================================

    public buildMethodContext(
        method: string
    ): AIContext {


        // ==========================================
        // Find methods directly called by the method
        // ==========================================

        const methods =
            this.graph.edges
                .filter(
                    edge =>
                        edge.from === method &&
                        edge.relation === "calls"
                )
                .map(
                    edge =>
                        edge.to
                );


        // ==========================================
        // Find locators used by the method itself
        // ==========================================

        const directLocators =
            this.graph.edges
                .filter(
                    edge =>
                        edge.from === method &&
                        edge.relation === "uses"
                )
                .map(
                    edge =>
                        edge.to
                );


        // ==========================================
        // Build method → locator dependencies
        // ==========================================

        const dependencies:
            MethodDependency[] = [];


        for (
            const calledMethod of methods
        ) {

            const locators =
                this.graph.edges
                    .filter(
                        edge =>
                            edge.from === calledMethod &&
                            (
                                edge.relation === "uses" ||
                                edge.relation === "indirectUses"
                            )
                    )
                    .map(
                        edge =>
                            edge.to
                    );


            dependencies.push({

                method:
                    calledMethod,

                locators

            });

        }


        // ==========================================
        // Collect all locators
        // ==========================================

        const locatorSet =
            new Set<string>(
                directLocators
            );


        dependencies.forEach(
            dependency => {

                dependency.locators.forEach(
                    locator => {

                        locatorSet.add(
                            locator
                        );

                    }
                );

            }
        );


        return {

            method,

            methods,

            locators:
                Array.from(
                    locatorSet
                ),

            dependencies

        };

    }

}