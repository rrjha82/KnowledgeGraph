import * as ts from "typescript";

export class ImportVisitor {

    public visit(
        sourceFile: ts.SourceFile
    ): string[] {

        const imports: string[] = [];

        sourceFile.statements.forEach(statement => {

            if (ts.isImportDeclaration(statement)) {

                const clause = statement.importClause;

                if (
                    clause &&
                    clause.namedBindings &&
                    ts.isNamedImports(clause.namedBindings)
                ) {

                    clause.namedBindings.elements.forEach(element => {

                        imports.push(
                            element.name.getText()
                        );

                    });

                }

            }

        });

        return imports;

    }

}