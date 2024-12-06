import Work from "../interfaces/work.js";

export default class Employee implements Work {
    name: string;
    id: number;
    title: string;
    salary: number;

    constructor(name: string, id: number, title: string, salary: number) {
        this.name = name;
        this.id = id;
        this.title = title;
        this.salary = salary;
    }

    receivePay(pay: number): number {
        return pay;
    }
}