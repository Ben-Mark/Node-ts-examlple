import {Animal, Dog, SearchOptions, UpdateOptions} from "./types";
import AnimalMySQL from "./animalMySQL";
import AnimalMongoDB from "./animalMongoDB";


export interface IAnimalDB {
    initDB(): Promise<void>;
    createAnimalDoc(animal: Animal): Promise<{ error: boolean | string }>;
    deleteAnimalDoc(id: string): Promise<{ error: boolean | string }>;
    readAnimalDoc(id: string): Promise<{ animal?: Animal, error: boolean | string }>;
    updateAnimalDoc(updateOptions: UpdateOptions): Promise<{ error: boolean | string }>;
    searchAnimalDoc(searchOptions: SearchOptions): Promise<{ animals?: Animal[], error: boolean | string }>;
}


export type DBType = 'mysql' | 'mongodb';

export class DBFactory {


    static supportedDBTypes: DBType[] = ['mysql', 'mongodb'];

    static createDB(): IAnimalDB {

        const DB_TYPE: string = process.env.DB_TYPE || process.env.DEFAULT_DB_TYPE || "Missing DEFAULT_DB_TYPE env variable, contact animal support";

        if (!this.supportedDBTypes.includes(DB_TYPE as DBType)) {
            throw new Error(`Invalid DB_TYPE: ${DB_TYPE}`);
        }

        switch(DB_TYPE) {
            case 'mysql':
                return new AnimalMySQL();
            case 'mongodb':
                return new AnimalMongoDB();
            default:
                throw new Error(`Invalid database type: ${DB_TYPE}`);
        }
    }
}
