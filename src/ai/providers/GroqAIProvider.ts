import Groq from "groq-sdk";
import { AIProvider } from "../models/AIProvider";

export class GroqAIProvider implements AIProvider {

    private groq: Groq;

    constructor() {

        const apiKey =
            process.env.GROQ_API_KEY;

        if (!apiKey) {

            throw new Error(
                "GROQ_API_KEY is not configured. " +
                "Please add it to your .env file."
            );

        }

        this.groq =
            new Groq({
                apiKey
            });
    }


    public async ask(
        prompt: string
    ): Promise<string> {

        const response =
            await this.groq.chat.completions.create({

                model: "openai/gpt-oss-20b",

                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]

            });

        return response.choices[0]?.message?.content ?? "";
    }

}