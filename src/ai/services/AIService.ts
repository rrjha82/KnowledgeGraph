import { ContextBuilder } from "../ContextBuilder";
import { PromptBuilder } from "../PromptBuilder";
import { AIProvider } from "../models/AIProvider";

export class AIService {

    constructor(
        private contextBuilder: ContextBuilder,
        private promptBuilder: PromptBuilder,
        private provider: AIProvider
    ) {}

    public async explainMethod(
        method: string
    ): Promise<string> {

        const context =
            this.contextBuilder.buildMethodContext(
                method
            );

        const prompt =
            this.promptBuilder.buildMethodPrompt(
                context
            );

        return await this.provider.ask(
            prompt
        );

    }

}