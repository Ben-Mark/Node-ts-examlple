const { v4: uuidv4 } = require('uuid');


export interface Animal {
    id: string;
    name: string;
    age: string;
    color: string;
}

export type AnimalInput = Omit<Animal, 'id'>;

export class Dog implements Animal {
    id: string;
    name: string;
    age: string;
    color: string;

    constructor(dog: AnimalInput) {
        this.id =  uuidv4();
        this.name = dog.name;
        this.age = dog.age;
        this.color = dog.color;
    }
}

export type SearchOptions = {
    age?: number
    notColor?: string
    color?: string
    sortBy?: string
}

export type UpdateOptions = {
    id: string;
    name?: string;
    age?: string;
    color?: string;
}



