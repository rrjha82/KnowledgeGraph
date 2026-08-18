export interface TestInfo {

    testName: string;
    imports: string[];

    pageObjects: Map<string, string>;

    methodCalls: string[];

    assertions: string[];

}