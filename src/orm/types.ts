const { v4: uuidv4 } = require('uuid');


export interface IAnimal {
    id: string;
    name: string;
    age: number;
    color: string;
}

export type AnimalInput = Omit<IAnimal, 'id'>;

export class Animal implements IAnimal {
    id: string;
    name: string;
    age: number;
    color: string;

    constructor(animal: AnimalInput) {
        this.id =  uuidv4();
        this.name = animal.name;
        this.age = animal.age;
        this.color = animal.color;
    }
}

export type SearchOptions = {
    ageGreaterThan?: number
    notColor?: string
    color?: string
    sortBy?: string
    searchString?: string
}


export type UpdateOptions = {
    id: string;
    name?: string;
    age?: number;
    color?: string;
}


export type DBErrorStatus = {
    error: boolean,
    errorMessage?: string
}

export type CreateDBResponse = DBErrorStatus

export type ReadDBResponse = {
    animal?: Animal
} & DBErrorStatus

export type UpdateDBResponse = DBErrorStatus

export type DeleteDBResponse = DBErrorStatus

export type SearchDBResponse = {
    animals?: Animal[]
} & DBErrorStatus
