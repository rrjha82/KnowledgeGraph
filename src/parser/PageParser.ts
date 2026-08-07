import * as ts from "typescript";
import * as fs from "fs";

import { PageInfo } from "../model/PageInfo";
import { MethodVisitor } from "./visitor/MethodVisitor";

export class PageParser {

    public parse(filePath: string): PageInfo {

        const sourceCode = fs.readFileSync(filePath, "utf8");

        const sourceFile = ts.createSourceFile(
            filePath,
            sourceCode,
            ts.ScriptTarget.Latest,
            true
        );

        const pageInfo: PageInfo = {

            pageName: "",

            locators: [],

            methods: []

        };

        const methodVisitor = new MethodVisitor();

        ts.forEachChild(sourceFile, node => {

            if (ts.isClassDeclaration(node)) {

                pageInfo.pageName = node.name?.getText() ?? "";

                node.members.forEach(member => {

                    // ----------------------------
                    // Extract Locators
                    // ----------------------------

                    if (ts.isPropertyDeclaration(member)) {

                        const propertyName = member.name.getText();

                        const typeName = member.type?.getText();

                        if (typeName === "Locator") {

                            pageInfo.locators.push(propertyName);

                        }

                    }

                    // ----------------------------
                    // Extract Methods
                    // ----------------------------

                    if (ts.isMethodDeclaration(member)) {

                        const methodInfo = methodVisitor.visit(
    member,
    pageInfo.pageName
);

                        pageInfo.methods.push(methodInfo);
                        console.log(methodInfo);

                    }

                });

            }

        });

        return pageInfo;

    }

}