import * as ts from "typescript";
import { TestInfo } from "../../model/TestInfo";

export class TestVisitor {

    public visit(
        node: ts.Node,
        testInfo: TestInfo
    ): void {

        // =====================================================
        // 1. Detect test(...)
        //
        // test('user registration test', async ({ }) => {
        // =====================================================

        if (ts.isCallExpression(node)) {

            const expressionText =
                node.expression.getText();


            if (
                expressionText === "test" &&
                node.arguments.length > 0
            ) {

                const firstArgument =
                    node.arguments[0];


                if (
                    ts.isStringLiteral(
                        firstArgument
                    )
                ) {

                    testInfo.testName =
                        firstArgument.text;

                }

            }

        }


        // =====================================================
        // 2. Detect Page Object Creation
        //
        // homepage = new Homepage(page)
        // registrationPage = new Registrationpage(page)
        //
        // Also handles:
        //
        // let homepage: Homepage;
        // let registrationPage: Registrationpage;
        // =====================================================

        if (ts.isBinaryExpression(node)) {

            if (
                node.operatorToken.kind ===
                ts.SyntaxKind.EqualsToken
            ) {

                const left =
                    node.left;

                const right =
                    node.right;


                if (
                    ts.isNewExpression(right)
                ) {

                    const variableName =
                        left.getText();

                    const className =
                        right.expression.getText();


                    if (
                        !testInfo.pageObjects.has(
                            variableName
                        )
                    ) {

                        testInfo.pageObjects.set(
                            variableName,
                            className
                        );

                    }

                }

            }

        }


        // =====================================================
        // 3. Detect Page Object Method Calls
        //
        // await homepage.clickOnMyAccount()
        //
        // await registrationPage.setFirstName(...)
        //
        // Result:
        //
        // Homepage.clickOnMyAccount
        // Registrationpage.setFirstName
        // =====================================================

        if (ts.isCallExpression(node)) {

            if (
                ts.isPropertyAccessExpression(
                    node.expression
                )
            ) {

                const objectExpression =
                    node.expression.expression;

                const variableName =
                    objectExpression.getText();

                const methodName =
                    node.expression.name.getText();


                const className =
                    testInfo.pageObjects.get(
                        variableName
                    );


                if (className) {

                    const fullMethodName =
                        `${className}.${methodName}`;


                    if (
                        !testInfo.methodCalls.includes(
                            fullMethodName
                        )
                    ) {

                        testInfo.methodCalls.push(
                            fullMethodName
                        );

                    }

                }

            }

        }


        // =====================================================
        // 4. Detect Assertions
        //
        // expect(confirmationmessage)
        //     .toContain("Your Account Has Been Created!")
        //
        // Capture the complete assertion.
        // =====================================================

        if (ts.isCallExpression(node)) {

            if (
                node.expression.getText() ===
                "expect"
            ) {

                let assertionNode: ts.Node =
                    node;


                // expect(...).toContain(...)
                if (
                    node.parent &&
                    ts.isPropertyAccessExpression(
                        node.parent
                    )
                ) {

                    if (
                        node.parent.parent &&
                        ts.isCallExpression(
                            node.parent.parent
                        )
                    ) {

                        assertionNode =
                            node.parent.parent;

                    }

                }


                const assertionText =
                    assertionNode.getText();


                if (
                    !testInfo.assertions.includes(
                        assertionText
                    )
                ) {

                    testInfo.assertions.push(
                        assertionText
                    );

                }

            }

        }


        // =====================================================
        // 5. Recursive Traversal
        // =====================================================

        ts.forEachChild(
            node,
            child => {

                this.visit(
                    child,
                    testInfo
                );

            }
        );

    }

}