import { MethodInfo } from "./MethodInfo";

export interface PageInfo {
    pageName: string;
    imports: string[];
    locators: string[];
    methods: MethodInfo[];
}