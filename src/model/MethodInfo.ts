export interface MethodInfo {

    // Method name only
    name: string;

    // Fully qualified name
    fullName: string;

    parameters: string[];

    usesLocators: string[];

    callsMethods: string[];

}