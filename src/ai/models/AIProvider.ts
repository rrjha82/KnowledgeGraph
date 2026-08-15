// src/ai/models/AIProvider.ts

export interface AIProvider {
    ask(prompt: string): Promise<string>;
}