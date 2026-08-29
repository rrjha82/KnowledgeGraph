import { KnowledgeGraph } from "../graph/KnowledgeGraph";
import { TestInfo } from "../model/TestInfo";
import { BDDContext } from "./BDDContext";

export class BDDContextBuilder {

    constructor(
        private graph: KnowledgeGraph
    ) {}

    public build(
        test: TestInfo
    ): BDDContext {

        const methodCalls =
            test.methodCalls;


        // ---------------------------------------------
        // Find locators used by test methods
        // ---------------------------------------------

        const locatorSet =
            new Set<string>();


        for (const method of methodCalls) {

            this.graph.edges
                .filter(edge =>
                    edge.from === method &&
                    (
                        edge.relation === "uses" ||
                        edge.relation === "indirectUses"
                    )
                )
                .forEach(edge => {

                    locatorSet.add(
                        edge.to
                    );

                });

        }


        // ---------------------------------------------
        // Page Objects
        // ---------------------------------------------

        const pageObjects =
            Array.from(
                test.pageObjects.values()
            );


        // ---------------------------------------------
        // Return BDD Context
        // ---------------------------------------------

        return {

            testName:
                test.testName,

            pageObjects,

            methodCalls,

            locators:
                Array.from(
                    locatorSet
                ),

            assertions:
                test.assertions

        };

    }

}