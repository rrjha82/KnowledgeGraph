import { KnowledgeGraph } from "../graph/KnowledgeGraph";
import { GraphQueryService } from "../service/GraphQueryService";

export class DependencyExplorer {

    private service: GraphQueryService;

    constructor(
        private graph: KnowledgeGraph
    ) {

        this.service = new GraphQueryService(graph);

    }

    public explain(node: string): void {

        console.log("");
        console.log("=================================");
        console.log("Dependency Explorer");
        console.log("=================================");
        console.log("");

        const visited = new Set<string>();

        this.walk(
            node,
            "",
            visited
        );

    }

    private walk(

        node: string,

        indent: string,

        visited: Set<string>

    ): void {

        console.log(indent + node);

        if (visited.has(node)) {

            return;

        }

        visited.add(node);

        //----------------------------------
        // Method Calls
        //----------------------------------

        const methods =
            this.service.getCalledMethods(node);

        methods.forEach(method => {

            this.walk(

                method,

                indent + "   ",

                visited

            );

        });

        //----------------------------------
        // Locator Usage
        //----------------------------------

        const locators =
            this.service.getUsedLocators(node);

        locators.forEach(locator => {

            console.log(

                indent + "   " + locator

            );

        });

    }

}