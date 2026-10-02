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

        return tests.filter(testName =>
            this.findLocatorsUsedByTest(testName)
                .some(x => x.toLowerCase() === target.toLowerCase())
        );
    }

    public findTestsDependingOnMethod(method: string): string[] {
        const target = this.normalize(method);
        const result = new Set<string>();
        const visited = new Set<string>();

        const walk = (current: string): void => {
            if (visited.has(current)) return;
            visited.add(current);

            this.graph.edges
                .filter(e => e.to === current && e.relation === "calls")
                .forEach(e => {
                    const node = this.graph.nodes.find(n => n.id === e.from);

                    if (node && node.type === "Test") {
                        result.add(e.from);
                    } else {
                        walk(e.from);
                    }
                });
        };

        walk(target);
        return Array.from(result);
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
        const normalized = this.normalize(method);
        return this.graph.edges
            .filter(e => e.to === normalized && e.relation === "calls")
            .map(e => e.from);
    }

    public findDirectMethodsUsingLocator(locator: string): string[] {
        const normalized = this.normalize(locator);
        return this.graph.edges
            .filter(e => e.to === normalized && e.relation === "uses")
            .filter(e => this.graph.nodes.some(n => n.id === e.from && n.type === "Method"))
            .map(e => e.from);
    }

    public findIndirectMethodsUsingLocator(locator: string): string[] {
        const normalized = this.normalize(locator);
        const direct = new Set(this.findDirectMethodsUsingLocator(normalized));
        const result = new Set<string>();
        const visited = new Set<string>();

        const walk = (method: string): void => {
            if (visited.has(method)) return;
            visited.add(method);

            this.findCallers(method).forEach(caller => {
                const node = this.graph.nodes.find(n => n.id === caller);

                if (node && node.type === "Method" && !direct.has(caller)) {
                    result.add(caller);
                    walk(caller);
                }
            });
        };

        direct.forEach(method => walk(method));
        return Array.from(result);
    }

    public findAffectedMethodsByLocator(locator: string): string[] {
        return [
            ...this.findDirectMethodsUsingLocator(locator),
            ...this.findIndirectMethodsUsingLocator(locator)
        ];
    }

    public findLocatorImpact(locator: string): LocatorQueryResult {
        const normalized = this.normalize(locator);

        const locatorNode = this.graph.nodes.find(
            n =>
                n.type === "Locator" &&
                n.id.toLowerCase() === normalized.toLowerCase()
        );

        if (!locatorNode) {
            return {
                found: false,
                locator: normalized,
                directMethods: [],
                indirectMethods: [],
                affectedMethods: [],
                affectedTests: []
            };
        }

        const directMethods = this.findDirectMethodsUsingLocator(normalized);
        const indirectMethods = this.findIndirectMethodsUsingLocator(normalized);

        return {
            found: true,
            locator: normalized,
            directMethods,
            indirectMethods,
            affectedMethods: [...directMethods, ...indirectMethods],
            affectedTests: this.findTestsUsingLocator(normalized)
        };
    }

    public findDependencyPaths(startNode: string): string[][] {
        const normalized = this.normalize(startNode);
        const paths: string[][] = [];

        const walk = (
            current: string,
            path: string[],
            visited: Set<string>
        ): void => {
            if (visited.has(current)) return;

            const nextVisited = new Set(visited);
            nextVisited.add(current);

            const incoming = this.graph.edges.filter(
                edge =>
                    edge.to === current &&
                    (edge.relation === "uses" || edge.relation === "calls")
            );

            if (incoming.length === 0) {
                paths.push(path);
                return;
            }

            incoming.forEach(edge => {
                walk(
                    edge.from,
                    [...path, edge.from],
                    nextVisited
                );
            });
        };

        walk(normalized, [normalized], new Set<string>());

        const unique = new Map<string, string[]>();

        paths.forEach(path => {
            unique.set(path.join("→"), path);
        });

        return Array.from(unique.values());
    }

    public findDependencyPathsWithRelations(
        startNode: string
    ): {
        node: string;
        relation?: string;
    }[][] {
        const normalized = this.normalize(startNode);
        const paths: {
            node: string;
            relation?: string;
        }[][] = [];

        const walk = (
            current: string,
            path: {
                node: string;
                relation?: string;
            }[],
            visited: Set<string>
        ): void => {
            if (visited.has(current)) return;

            const nextVisited = new Set(visited);
            nextVisited.add(current);

            const incoming = this.graph.edges.filter(
                edge =>
                    edge.to === current &&
                    (edge.relation === "uses" || edge.relation === "calls")
            );

            if (incoming.length === 0) {
                paths.push(path);
                return;
            }

            incoming.forEach(edge => {
                walk(
                    edge.from,
                    [
                        ...path,
                        {
                            node: edge.from,
                            relation:
                                edge.relation === "uses"
                                    ? "used by"
                                    : "called by"
                        }
                    ],
                    nextVisited
                );
            });
        };

        walk(
            normalized,
            [{ node: normalized }],
            new Set<string>()
        );

        const unique = new Map<
            string,
            {
                node: string;
                relation?: string;
            }[]
        >();

        paths.forEach(path => {
            const key = path
                .map(step => `${step.relation ?? ""}:${step.node}`)
                .join("|");

            unique.set(key, path);
        });

        return Array.from(unique.values());
    }

    public findLocator(locatorName: string): LocatorQueryResult {
        return this.findLocatorImpact(locatorName);
    }
}
