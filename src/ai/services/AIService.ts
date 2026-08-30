import { AIProvider } from "../models/AIProvider";

import { ContextBuilder } from "../ContextBuilder";
import { PromptBuilder } from "../PromptBuilder";

import { ImpactPromptBuilder } from "../ImpactPromptBuilder";
import { LocatorPromptBuilder } from "../LocatorPromptBuilder";

import { TestContext } from "../TestContext";
import { TestPromptBuilder } from "../TestPromptBuilder";

import { ImpactContext } from "../ImpactContext";
import { LocatorContext } from "../LocatorContext";

import { BDDContext } from "../BDDContext";


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
        context: ImpactContext
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
        context: LocatorContext
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


    // ==============================================
    // Generate BDD
    // ==============================================

    public async generateBDD(
        context: BDDContext
    ): Promise<string> {

        const prompt =
            this.promptBuilder.buildBDDPrompt(
                context
            );


        return await this.provider.ask(
            prompt
        );

    }

}