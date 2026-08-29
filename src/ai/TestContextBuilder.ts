import { KnowledgeGraph } from "../graph/KnowledgeGraph";
import { TestInfo } from "../model/TestInfo";
import {
    TestContext,
    TestMethodDependency
} from "./TestContext";


export class TestContextBuilder {

    constructor(
        private graph: KnowledgeGraph
    ) {}


    public build(
        test: TestInfo
    ): TestContext {

        const dependencies:
            TestMethodDependency[] = [];

        const locatorSet =
            new Set<string>();


        for (
            const method of test.methodCalls
        ) {

            const locators =
                this.graph.edges
                    .filter(
                        edge =>
                            edge.from === method &&
                            (
                                edge.relation === "uses" ||
                                edge.relation === "indirectUses"
                            )
                    )
                    .map(
                        edge =>
                            edge.to
                    );


            locators.forEach(
                locator => {

                    locatorSet.add(
                        locator
                    );

                }
            );


            dependencies.push({

                method,

                locators

            });

        }


        const pageObjects =
            Array.from(
                test.pageObjects.keys()
            );


        return {

            testName:
                test.testName,

            imports:
                test.imports,

            pageObjects,

            methodCalls:
                test.methodCalls,

            dependencies,

            locators:
                Array.from(
                    locatorSet
                ),

            assertions:
                test.assertions

        };

    }

}