import { PageInfo } from "../model/PageInfo";
import { TestInfo } from "../model/TestInfo";

export class ParserDemo {

    public run(
        pages: PageInfo[],
        tests: TestInfo[]
    ): void {

        console.log("");
        console.log("=================================");
        console.log("PARSER DEMO");
        console.log("=================================");

        console.log("");
        console.log("Parsed Pages");
        console.log("--------------------------------");

        pages.forEach(page => {

            console.log(JSON.stringify(page, null, 2));

        });

        console.log("");
        console.log("Parsed Tests");
        console.log("--------------------------------");

        tests.forEach(test => {

            console.log(JSON.stringify(test, null, 2));

        });

    }

}