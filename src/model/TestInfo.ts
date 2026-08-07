export interface TestInfo {

    testName: string;

    pageObjects: Map<string, string>;

    methodCalls: string[];

    assertions: string[];

}