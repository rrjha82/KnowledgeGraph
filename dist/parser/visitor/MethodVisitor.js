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
exports.MethodVisitor = void 0;
const ts = __importStar(require("typescript"));
class MethodVisitor {
    visit(methodNode, pageName) {
        const methodInfo = {
            // Method Name
            name: methodNode.name.getText(),
            // Fully Qualified Method Name
            fullName: `${pageName}.${methodNode.name.getText()}`,
            // Parameters
            parameters: methodNode.parameters.map(parameter => parameter.name.getText()),
            // Locators used by this method
            usesLocators: [],
            // Methods called by this method
            callsMethods: []
        };
        // Traverse method body
        if (methodNode.body) {
            ts.forEachChild(methodNode.body, node => {
                this.visitNode(node, methodInfo, pageName);
            });
        }
        return methodInfo;
    }
    visitNode(node, methodInfo, pageName) {
        // =====================================================
        // Detect Locator Usage
        // Example:
        // this.txtEmail.fill(email)
        // =====================================================
        if (ts.isPropertyAccessExpression(node)) {
            const expression = node.expression;
            if (ts.isPropertyAccessExpression(expression) &&
                expression.expression.kind === ts.SyntaxKind.ThisKeyword) {
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
            if (ts.isPropertyAccessExpression(expression) &&
                expression.expression.kind === ts.SyntaxKind.ThisKeyword) {
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
                    const fullMethodName = `${pageName}.${methodName}`;
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
            this.visitNode(child, methodInfo, pageName);
        });
    }
}
exports.MethodVisitor = MethodVisitor;
