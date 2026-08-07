import * as fs from "fs";
import * as path from "path";

export class FileScanner {

    private ignoreFolders = [
        "node_modules",
        "playwright-report",
        "test-results",
        ".git"
    ];

    public scan(projectPath: string): string[] {

        const files: string[] = [];

        this.scanDirectory(projectPath, files);

        return files;
    }

    private scanDirectory(dir: string, files: string[]) {

        const items = fs.readdirSync(dir);

        for (const item of items) {

            const fullPath = path.join(dir, item);

            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {

                if (!this.ignoreFolders.includes(item)) {

                    this.scanDirectory(fullPath, files);

                }

            }

            else {

                if (
    item.endsWith(".ts") &&
    !item.endsWith(".config.ts") &&
    item !== "playwright.config.ts" &&
    item !== "tsconfig.ts"
) {
    files.push(fullPath);
}

            }

        }

    }

}