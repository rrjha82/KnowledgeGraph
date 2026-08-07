import * as ts from "typescript";
import { MethodInfo } from "../../model/MethodInfo";

export class MethodVisitor {

    public visit(
        methodNode: ts.MethodDeclaration,
        pageName: string
    ): MethodInfo {

        const methodInfo: MethodInfo = {

            // Method Name
            name: methodNode.name.getText(),

            // Fully Qualified Method Name
            fullName: `${pageName}.${methodNode.name.getText()}`,

            // Parameters
            parameters: methodNode.parameters.map(parameter =>
                parameter.name.getText()
            ),

            // Locators used by this method
            usesLocators: [],

            // Methods called by this method
            callsMethods: []

        };

        // Traverse method body
        if (methodNode.body) {

            ts.forEachChild(methodNode.body, node => {

                this.visitNode(
                    node,
                    methodInfo,
                    pageName
                );

            });

        }

        return methodInfo;

    }

    private visitNode(
        node: ts.Node,
        methodInfo: MethodInfo,
        pageName: string
    ): void {

        // =====================================================
        // Detect Locator Usage
        // Example:
        // this.txtEmail.fill(email)
        // =====================================================

        if (ts.isPropertyAccessExpression(node)) {

            const expression = node.expression;

            if (
                ts.isPropertyAccessExpression(expression) &&
                expression.expression.kind === ts.SyntaxKind.ThisKeyword
            ) {

                const locatorName = expression.name.getText();

                if (!methodInfo.usesLocators.includes(locatorName)) {

                    methodInfo.usesLocators.push(locatorName);

                }

            }

        }

        // =====================================================
        // Detect Internal Method Calls
        // Example:
        // this.setPassword(password)
        // =====================================================

        if (ts.isCallExpression(node)) {

            const expression = node.expression;

            if (
                ts.isPropertyAccessExpression(expression) &&
                expression.expression.kind === ts.SyntaxKind.ThisKeyword
            ) {

                const methodName = expression.name.getText();

                // Ignore Playwright Locator APIs
                const locatorActions = [

                    "fill",
                    "click",
                    "check",
                    "uncheck",
                    "press",
                    "hover",
                    "focus",
                    "type",
                    "textContent",
                    "innerText",
                    "innerHTML",
                    "inputValue",
                    "isVisible",
                    "isHidden",
                    "isEnabled",
                    "isDisabled",
                    "selectOption",
                    "clear",
                    "dblclick",
                    "dragTo",
                    "locator",
                    "nth",
                    "first",
                    "last",
                    "filter",

                    // Assertions
                    "toBeVisible",
                    "toContainText",
                    "toHaveText",
                    "toBeEnabled",
                    "toBeDisabled",
                    "toHaveValue",
                    "toHaveCount",
                    "toBeChecked",
                    "toBeHidden"

                ];

                if (!locatorActions.includes(methodName)) {

                    const fullMethodName =
                        `${pageName}.${methodName}`;

                    if (!methodInfo.callsMethods.includes(fullMethodName)) {

                        methodInfo.callsMethods.push(fullMethodName);

                    }

                }

            }

        }

        // =====================================================
        // Recursive Traversal
        // =====================================================

        ts.forEachChild(node, child => {

            this.visitNode(
                child,
                methodInfo,
                pageName
            );

        });

    }

}