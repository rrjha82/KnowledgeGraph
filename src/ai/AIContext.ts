export interface MethodDependency {

    method: string;

    locators: string[];

}


export interface AIContext {

    method: string;

    methods: string[];

    locators: string[];

    dependencies: MethodDependency[];

}