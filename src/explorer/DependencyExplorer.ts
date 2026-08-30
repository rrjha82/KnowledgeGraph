import { KnowledgeGraph } from "../graph/KnowledgeGraph";
import { QueryEngine } from "../query/QueryEngine";


export class DependencyExplorer {

    private queryEngine: QueryEngine;


    constructor(
        private graph: KnowledgeGraph
    ) {

        this.queryEngine =
            new QueryEngine(
                graph
            );

    }


    // ==================================================
    // EXPLAIN DEPENDENCY TREE
    // ==================================================

    public explain(
        node: string
    ): void {

        console.log("");

        console.log(
            "================================="
        );

        console.log(
            "Dependency Explorer"
        );

        console.log(
            "================================="
        );

        console.log("");

        const visited =
            new Set<string>();


        this.walk(
            node,
            "",
            visited
        );

    }


    // ==================================================
    // WALK GRAPH
    // ==================================================

    private walk(

        node: string,

        indent: string,

        visited: Set<string>

    ): void {


        console.log(
            indent + node
        );


        if (
            visited.has(node)
        ) {

            return;

        }


        visited.add(
            node
        );


        // ----------------------------------------------
        // Methods Called
        // ----------------------------------------------

        const methods =
            this.queryEngine
                .findMethodsCalledByTest(
                    node
                );


        methods.forEach(
            method => {

                console.log(
                    indent +
                    "   calls → " +
                    method
                );


                this.walk(
                    method,
                    indent + "   ",
                    visited
                );

            }
        );


        // ----------------------------------------------
        // Methods Called By Methods
        // ----------------------------------------------

        const callers =
            this.queryEngine
                .findCallers(
                    node
                );


        callers.forEach(
            caller => {

                if (
                    !methods.includes(caller)
                ) {

                    console.log(
                        indent +
                        "   called by → " +
                        caller
                    );

                }

            }
        );


        // ----------------------------------------------
        // Direct Locators
        // ----------------------------------------------

        const directLocators =
            this.queryEngine
                .findDirectLocatorsByMethod(
                    node
                );


        directLocators.forEach(
            locator => {

                console.log(
                    indent +
                    "   uses → " +
                    locator
                );

            }
        );


        // ----------------------------------------------
        // Indirect Locators
        // ----------------------------------------------

        const indirectLocators =
            this.graph.edges
                .filter(
                    edge =>
                        edge.from === node &&
                        edge.relation === "indirectUses"
                )
                .map(
                    edge =>
                        edge.to
                );


        indirectLocators.forEach(
            locator => {

                console.log(
                    indent +
                    "   indirectly uses → " +
                    locator
                );

            }
        );

    }

}