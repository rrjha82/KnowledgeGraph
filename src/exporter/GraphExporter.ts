import * as fs from "fs";
import * as path from "path";
import { KnowledgeGraph } from "../graph/KnowledgeGraph";

export class GraphExporter {

    public export(
        graph: KnowledgeGraph,
        fileName: string = "knowledge-graph.json"
    ): void {

        const outputFolder = path.join(process.cwd(), "output");

        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder);
        }

        const outputFile = path.join(outputFolder, fileName);

        fs.writeFileSync(
            outputFile,
            JSON.stringify(graph, null, 2),
            "utf8"
        );

        console.log("");
        console.log("==================================");
        console.log("Knowledge Graph Exported");
        console.log("==================================");
        console.log(outputFile);
    }

}