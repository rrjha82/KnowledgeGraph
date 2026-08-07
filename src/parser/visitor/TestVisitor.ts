import * as ts from "typescript";
import { TestInfo } from "../../model/TestInfo";

export class TestVisitor {

    public visit(
        node: ts.Node,
        testInfo: TestInfo
    ): void {

        // =====================================================
        // Detect Test Name
        // Example:
        // test('user registration test', ...)
        // =====================================================

        if (ts.isCallExpression(node)) {

            if (
                node.expression.getText() === "test" &&
                node.arguments.length > 0
            ) {

                const firstArgument = node.arguments[0];

                if (ts.isStringLiteral(firstArgument)) {

                    testInfo.testName = firstArgument.text;

                }

            }

        }

        // =====================================================
        // Detect Page Object Creation
        //
        // homepage = new Homepage(page)
        // registrationPage = new Registrationpage(page)
        // =====================================================

        if (ts.isBinaryExpression(node)) {

            if (
                node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
                ts.isNewExpression(node.right)
            ) {

                const variableName = node.left.getText();

                const className = node.right.expression.getText();

                testInfo.pageObjects.set(
                    variableName,
                    className
                );

            }

        }

        // =====================================================
        // Detect Page Method Calls
        //
        // registrationPage.setEmail()
        //
        // Store:
        // Registrationpage.setEmail
        // =====================================================

        if (ts.isCallExpression(node)) {

            if (ts.isPropertyAccessExpression(node.expression)) {

                const variableName =
                    node.expression.expression.getText();

                const methodName =
                    node.expression.name.getText();

                const className =
                    testInfo.pageObjects.get(variableName);

                if (className) {

                    const fullMethodName =
                        `${className}.${methodName}`;

                    if (
                        !testInfo.methodCalls.includes(fullMethodName)
                    ) {

                        testInfo.methodCalls.push(fullMethodName);

                    }

                }

            }

        }

        // =====================================================
        // Detect Assertions
        // =====================================================

        if (ts.isCallExpression(node)) {

            if (node.expression.getText() === "expect") {

                if (
                    !testInfo.assertions.includes("expect")
                ) {

                    testInfo.assertions.push("expect");

                }

            }

        }

        // =====================================================
        // Recursive Traversal
        // =====================================================

        ts.forEachChild(node, child => {

            this.visit(child, testInfo);

        });

    }

}