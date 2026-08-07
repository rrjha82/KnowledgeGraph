import { MethodInfo } from "./MethodInfo";

export interface PageInfo {
    pageName: string;
    locators: string[];
    methods: MethodInfo[];
}