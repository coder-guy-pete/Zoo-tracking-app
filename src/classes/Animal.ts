import ZooAnimals from "../interfaces/ZooAnimals.js";

export default class Animal implements ZooAnimals {
    species: string;
    hungry: boolean;
    amount: number;
    weight: number;

    constructor(species: string, hungry: boolean, amount: number, weight: number) {
        this.species = species;
        this.hungry = hungry;
        this.weight = weight;
        this.amount = amount;
    }
}