import * as ts from "typescript";
import * as fs from "fs";
import { TestInfo } from "../model/TestInfo";
import { TestVisitor } from "./visitor/TestVisitor";

export class TestParser {

    public parse(filePath: string): TestInfo {

        const sourceCode = fs.readFileSync(filePath, "utf8");

        const sourceFile = ts.createSourceFile(
            filePath,
            sourceCode,
            ts.ScriptTarget.Latest,
            true
        );

    const testInfo: TestInfo = {

    testName: "",

    pageObjects: new Map(),

    methodCalls: [],

    assertions: []

};
        const visitor = new TestVisitor();

visitor.visit(sourceFile, testInfo);

return testInfo;

    }

}