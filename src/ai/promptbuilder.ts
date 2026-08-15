export class PromptBuilder {

    public buildMethodPrompt(context: any): string {

        let prompt = "";

        prompt += "You are an expert Playwright Automation Engineer.\n\n";

        prompt += "Analyze the following method.\n\n";

        prompt += `Method: ${context.method}\n\n`;

        prompt += "Methods Called:\n";

        context.methods.forEach((method: string) => {

            prompt += `- ${method}\n`;

        });

        prompt += "\n";

        prompt += "Locators Used:\n";

        context.locators.forEach((locator: string) => {

            prompt += `- ${locator}\n`;

        });

        prompt += "\n";

        prompt += "Explain:\n";

        prompt += "1. Purpose of this method.\n";
        prompt += "2. Business functionality.\n";
        prompt += "3. Playwright flow.\n";
        prompt += "4. Possible validations.\n";
        prompt += "5. Generate a BDD Scenario.";

        return prompt;

    }

}