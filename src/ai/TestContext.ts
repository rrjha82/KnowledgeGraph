export interface TestMethodDependency {

    method: string;

    locators: string[];

}


export interface TestContext {

    testName: string;

    imports: string[];

    pageObjects: string[];

    methodCalls: string[];

    dependencies: TestMethodDependency[];

    locators: string[];

    assertions: string[];

}