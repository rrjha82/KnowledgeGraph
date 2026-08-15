export interface AIContext {

    page?: string;

    method?: string;

    locators: string[];

    calledMethods: string[];

    callers: string[];

    imports: string[];

    tests: string[];

    assertions: string[];

    description: string;

}