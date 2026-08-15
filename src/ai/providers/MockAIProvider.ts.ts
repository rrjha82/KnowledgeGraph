// src/ai/providers/MockAIProvider.ts

import { AIProvider } from "../models/AIProvider";

export class MockAIProvider implements AIProvider {

    async ask(prompt: string): Promise<string> {

        return `
Mock Response

Prompt received:

${prompt}
`;

    }

}