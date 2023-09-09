import {
    Animal,
    CreateDBResponse,
    DeleteDBResponse,
    IAnimal,
    ReadDBResponse, SearchDBResponse, SearchOptions,
    UpdateDBResponse,
    UpdateOptions
} from "./types";
import {IAnimalDB} from "./iAnimalDB";
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';


export abstract class BaseAnimalDB implements IAnimalDB{

    initDocuments = async (): Promise<void> => {

        // Create 10 animal documents
        for (let i = 0; i < 10; i++) {
            // Generate random color
            const randomColor: string = uniqueNamesGenerator({
                dictionaries: [colors]
            }); // red_big_donkey

            // Generate random age between 2 and 15
            const randomAge = Math.floor(Math.random() * (15 - 2 + 1)) + 2;

            // Generate a random animal name. You can replace this with a more sophisticated naming logic if needed.
            // Generate a random animal name.
            const animalName: string = uniqueNamesGenerator({
                dictionaries: [animals]
            }); // red_big_donkey


            const animal = new Animal({
                name: animalName,
                age: randomAge,
                color: randomColor,
            });

            await this.createAnimalDoc(animal);
        }
    }

    // Declare other methods from the interface without implementation
    abstract initDB(): Promise<void>;
    abstract createAnimalDoc(animal: IAnimal): Promise<CreateDBResponse>;
    abstract deleteAnimalDoc(id: string): Promise<DeleteDBResponse>;
    abstract readAnimalDoc(id: string): Promise<ReadDBResponse>;
    abstract updateAnimalDoc(updateOptions: UpdateOptions): Promise<UpdateDBResponse>;
    abstract searchAnimalDoc(searchOptions: SearchOptions): Promise<SearchDBResponse>;
}
