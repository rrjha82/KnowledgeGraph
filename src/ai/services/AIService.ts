import { AIProvider } from "../models/AIProvider";

import { ContextBuilder } from "../ContextBuilder";
import { PromptBuilder } from "../PromptBuilder";

import { ImpactPromptBuilder } from "../ImpactPromptBuilder";
import { LocatorPromptBuilder } from "../LocatorPromptBuilder";

import { TestContext } from "../TestContext";
import { TestPromptBuilder } from "../TestPromptBuilder";


export class AIService {

    constructor(
        private contextBuilder: ContextBuilder,
        private promptBuilder: PromptBuilder,
        private provider: AIProvider
    ) {}


    // ==============================================
    // Send prompt directly to AI provider
    // ==============================================

    public async ask(
        prompt: string
    ): Promise<string> {

        return await this.provider.ask(
            prompt
        );

    }


    // ==============================================
    // Explain Method
    // ==============================================

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


    // ==============================================
    // Impact Analysis
    // ==============================================

    public async analyzeImpact(
        context: {
            locator: string;
            directMethods: string[];
            indirectMethods: string[];
            affectedMethods: string[];
            affectedTests: string[];
        }
    ): Promise<string> {

        const impactPromptBuilder =
            new ImpactPromptBuilder();


        const prompt =
            impactPromptBuilder.buildPrompt(
                context
            );


        return await this.provider.ask(
            prompt
        );

    }


    // ==============================================
    // Locator Analysis
    // ==============================================

    public async analyzeLocator(
        context: {
            locator: string;
            methods: string[];
            tests: string[];
        }
    ): Promise<string> {

        const locatorPromptBuilder =
            new LocatorPromptBuilder();


        const prompt =
            locatorPromptBuilder.buildPrompt(
                context
            );


        return await this.provider.ask(
            prompt
        );

    }


    // ==============================================
    // Test Explanation
    // ==============================================

    public async explainTest(
        context: TestContext
    ): Promise<string> {

        const testPromptBuilder =
            new TestPromptBuilder();


        const prompt =
            testPromptBuilder.buildPrompt(
                context
            );


        return await this.provider.ask(
            prompt
        );

    }

}