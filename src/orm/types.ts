const { v4: uuidv4 } = require('uuid');


export interface Animal {
    id: string;
    name: string;
    age: number;
    color: string;
}

export type AnimalInput = Omit<Animal, 'id'>;

export class Cat implements Animal {
    id: string;
    name: string;
    age: number;
    color: string;

    constructor(cat: AnimalInput) {
        this.id =  uuidv4();
        this.name = cat.name;
        this.age = cat.age;
        this.color = cat.color;
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
