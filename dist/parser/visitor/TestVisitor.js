"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestVisitor = void 0;
const ts = __importStar(require("typescript"));
class TestVisitor {
    visit(node, testInfo) {
        // =====================================================
        // Detect Test Name
        // Example:
        // test('user registration test', ...)
        // =====================================================
        if (ts.isCallExpression(node)) {
            if (node.expression.getText() === "test" &&
                node.arguments.length > 0) {
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
            if (node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
                ts.isNewExpression(node.right)) {
                const variableName = node.left.getText();
                const className = node.right.expression.getText();
                testInfo.pageObjects.set(variableName, className);
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
                const variableName = node.expression.expression.getText();
                const methodName = node.expression.name.getText();
                const className = testInfo.pageObjects.get(variableName);
                if (className) {
                    const fullMethodName = `${className}.${methodName}`;
                    if (!testInfo.methodCalls.includes(fullMethodName)) {
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
                if (!testInfo.assertions.includes("expect")) {
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
exports.TestVisitor = TestVisitor;
