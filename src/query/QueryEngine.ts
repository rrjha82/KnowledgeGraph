import { KnowledgeGraph } from "../graph/KnowledgeGraph";

export interface LocatorQueryResult {
    found: boolean;
    locator: string;
    directMethods: string[];
    indirectMethods: string[];
    affectedMethods: string[];
    affectedTests: string[];
}

export class QueryEngine {
    constructor(private graph: KnowledgeGraph) {}

    private normalize(value: string): string {
        return value.trim().replace(/[?.,!]+$/g, "").trim();
    }

    public findMethodsByPage(pageName: string): string[] {
        return this.graph.edges
            .filter(e => e.from === pageName && e.relation === "contains")
            .filter(e => this.graph.nodes.some(n => n.id === e.to && n.type === "Method"))
            .map(e => e.to);
    }

    public findLocatorsByPage(pageName: string): string[] {
        return this.graph.edges
            .filter(e => e.from === pageName && e.relation === "contains")
            .filter(e => this.graph.nodes.some(n => n.id === e.to && n.type === "Locator"))
            .map(e => e.to);
    }

    public findMethodsCalledByTest(testName: string): string[] {
        const name = this.normalize(testName);
        return this.graph.edges
            .filter(e => e.from === name && e.relation === "calls")
            .map(e => e.to);
    }

    public findMethodsCalledByMethod(method: string): string[] {
        const name = this.normalize(method);
        return this.graph.edges
            .filter(e => e.from === name && e.relation === "calls")
            .map(e => e.to);
    }

    public findDirectLocatorsByMethod(method: string): string[] {
        const name = this.normalize(method);
        return this.graph.edges
            .filter(e => e.from === name && e.relation === "uses")
            .map(e => e.to);
    }

    public findLocatorsUsedByTest(testName: string): string[] {
        const name = this.normalize(testName);
        const result = new Set<string>();
        const visited = new Set<string>();

        this.graph.edges
            .filter(e =>
                e.from === name &&
                (e.relation === "uses" || e.relation === "indirectUses")
            )
            .forEach(e => result.add(e.to));

        const walk = (method: string): void => {
            if (visited.has(method)) return;
            visited.add(method);

            this.findDirectLocatorsByMethod(method)
                .forEach(locator => result.add(locator));

            this.findMethodsCalledByMethod(method)
                .forEach(child => walk(child));
        };

        this.findMethodsCalledByTest(name)
            .forEach(method => walk(method));

        return Array.from(result);
    }

    public findTestsUsingLocator(locator: string): string[] {
        const target = this.normalize(locator);
        const tests = this.graph.nodes
            .filter(n => n.type === "Test")
            .map(n => n.id);

        return tests.filter(test =>
            this.findLocatorsUsedByTest(test)
                .some(x => x.toLowerCase() === target.toLowerCase())
        );
    }

    public findTestsDependingOnMethod(
    method: string
): string[] {

    const target =
        this.normalize(method);


    const result =
        new Set<string>();


    // ==============================================
    // Get all Test nodes
    // ==============================================

    const tests =
        this.graph.nodes
            .filter(
                node =>
                    node.type === "Test"
            )
            .map(
                node =>
                    node.id
            );


    // ==============================================
    // Check each Test
    // ==============================================

    for (
        const test of tests
    ) {

        const visited =
            new Set<string>();


        const walk =
            (
                current: string
            ): boolean => {

                if (
                    visited.has(current)
                ) {

                    return false;

                }


                visited.add(
                    current
                );


                // ----------------------------------
                // Did this method reach the target?
                // ----------------------------------

                if (
                    current.toLowerCase() ===
                    target.toLowerCase()
                ) {

                    return true;

                }


                // ----------------------------------
                // Find methods called by current
                // ----------------------------------

                const calledMethods =
                    this.graph.edges
                        .filter(
                            edge =>
                                edge.from === current &&
                                edge.relation === "calls"
                        )
                        .map(
                            edge =>
                                edge.to
                        );


                // ----------------------------------
                // Continue recursively
                // ----------------------------------

                return calledMethods.some(
                    calledMethod =>
                        walk(
                            calledMethod
                        )
                );

            };


        // ==========================================
        // Start from the Test
        // ==========================================

        if (
            walk(test)
        ) {

            result.add(
                test
            );

        }

    }


    return Array.from(
        result
    );

}

    public findImportsByPage(page: string): string[] {
        return this.graph.edges
            .filter(e => e.from === page && e.relation === "imports")
            .map(e => e.to);
    }

    public findImportsByTest(test: string): string[] {
        return this.graph.edges
            .filter(e => e.from === test && e.relation === "imports")
            .map(e => e.to);
    }

    public findCallers(method: string): string[] {
        const target = this.normalize(method);
        return this.graph.edges
            .filter(e => e.to === target && e.relation === "calls")
            .map(e => e.from);
    }

    public findDirectMethodsUsingLocator(locator: string): string[] {
        const target = this.normalize(locator);
        return this.graph.edges
            .filter(e => e.to === target && e.relation === "uses")
            .filter(e => this.graph.nodes.some(n => n.id === e.from && n.type === "Method"))
            .map(e => e.from);
    }

    public findIndirectMethodsUsingLocator(locator: string): string[] {
        const direct = new Set(this.findDirectMethodsUsingLocator(locator));
        const result = new Set<string>();
        const visited = new Set<string>();

        const walk = (method: string): void => {
            if (visited.has(method)) return;
            visited.add(method);

            this.findCallers(method).forEach(caller => {
                if (!direct.has(caller)) result.add(caller);
                walk(caller);
            });
        };

        direct.forEach(method => walk(method));
        return Array.from(result);
    }

    public findAffectedMethodsByLocator(locator: string): string[] {
        return Array.from(new Set([
            ...this.findDirectMethodsUsingLocator(locator),
            ...this.findIndirectMethodsUsingLocator(locator)
        ]));
    }

    public findLocatorImpact(locator: string): LocatorQueryResult {
        const target = this.normalize(locator);

        const found = this.graph.nodes.some(n =>
            n.type === "Locator" &&
            n.id.toLowerCase() === target.toLowerCase()
        );

        if (!found) {
            return {
                found: false,
                locator: target,
                directMethods: [],
                indirectMethods: [],
                affectedMethods: [],
                affectedTests: []
            };
        }

        const directMethods = this.findDirectMethodsUsingLocator(target);
        const indirectMethods = this.findIndirectMethodsUsingLocator(target);
        const affectedMethods = Array.from(new Set([
            ...directMethods,
            ...indirectMethods
        ]));

        return {
            found: true,
            locator: target,
            directMethods,
            indirectMethods,
            affectedMethods,
            affectedTests: this.findTestsUsingLocator(target)
        };
    }

    public findDependencyPaths(startNode: string): string[][] {
        const start = this.normalize(startNode);
        const paths: string[][] = [];

        const walk = (
            current: string,
            path: string[],
            visited: Set<string>
        ): void => {
            if (visited.has(current)) return;

            const nextVisited = new Set(visited);
            nextVisited.add(current);

            const incoming = this.graph.edges.filter(e =>
                e.to === current &&
                (e.relation === "uses" || e.relation === "calls")
            );

            if (incoming.length === 0) {
                paths.push(path);
                return;
            }

            incoming.forEach(e =>
                walk(e.from, [...path, e.from], nextVisited)
            );
        };

        walk(start, [start], new Set<string>());

        const unique = new Map<string, string[]>();
        paths.forEach(path => unique.set(path.join("→"), path));

        return Array.from(unique.values());
    }

    public findLocator(locatorName: string): LocatorQueryResult {
        return this.findLocatorImpact(locatorName);
    }
}
