import { KnowledgeGraph } from "../graph/KnowledgeGraph";
import { ContextBuilder } from "../ai/ContextBuilder";
import { PromptBuilder } from "../ai/PromptBuilder";

export class AIDemo {

    constructor(
        private graph: KnowledgeGraph
    ) {}

    public run(): void {

        console.log("");
        console.log("=================================");
        console.log("AI DEMO");
        console.log("=================================");
        console.log("");

        const contextBuilder =
            new ContextBuilder(this.graph);

      const context =
    contextBuilder.buildMethodContext(
        "Registrationpage.completeRegistration"
    );

        console.log("AI Context");
        console.log("");

        console.log(
            JSON.stringify(context, null, 2)
        );

        const promptBuilder =
            new PromptBuilder();

        const prompt =
            promptBuilder.buildMethodPrompt(context);

        console.log("");
        console.log("AI Prompt");
        console.log("");

        console.log(prompt);

    }

}