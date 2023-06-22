import {
    Animal, CreateDBResponse, DBErrorStatus, DeleteDBResponse, ReadDBResponse, SearchDBResponse,
    SearchOptions, UpdateDBResponse, UpdateOptions,
} from "./types";
import {IAnimalDB} from "./iAnimalDB";
import url from "url";

const {MongoClient} = require('mongodb')


class AnimalMongoDB implements IAnimalDB{

    dogsColName: string = "dogs-col"
    client: any
    db: any


    initDB = async () => {
        try{
            const dbUrl = url.parse(process.env.MONGO_DB_URI || 'MISSING MONGO_DB_URI env variable, contact Animal support');
            const dbName = dbUrl.pathname?.substring(1) || '';
            this.client = await MongoClient.connect(`${dbUrl.protocol}//${dbUrl.auth}@${dbUrl.hostname}:${dbUrl.port}`, {useNewUrlParser: true});
            this.db = this.client.db(dbName);

            await this.getOrCreateCollection(this.dogsColName);

            console.log(`${dbName} DB initialized`);
        }catch(e){
            console.error(e.message)
            throw new Error(e)
        }
    }

    async createAnimalDoc(animal: Animal): Promise<CreateDBResponse> {
        try {

            const col = await this.getOrCreateCollection(this.dogsColName);
            if (!col) {
                return {
                    error: true,
                    errorMessage: `failed to get or create collection: ${this.dogsColName} in db: ${process.env.DB_PERMIETER}`,
                }
            }

            const query = {id: animal.id};

            const update = {$set: animal};
            const options = {upsert: true};
            await col.updateOne(query, update, options);

            return {
                error: false
            }

        } catch (e) {
            return {
                error: true,
                errorMessage: e.message,
            }
        }

    }


    async readAnimalDoc(id: string): Promise<ReadDBResponse> {
        try {

            const col = await this.getOrCreateCollection(this.dogsColName);
            if (!col) {
                return {
                    error: true,
                    errorMessage: `failed to get or create collection: ${this.dogsColName} in db: ${process.env.DB_PERMIETER}`,
                }
            }

            const query = {id: id};


            const animalDoc: Animal = await col.findOne(query);

            if (!animalDoc) {
                const errorMessage = `Animal document by id: ${id} couldnt be found`
                console.log(errorMessage);
                return {
                    error: true,
                    errorMessage: errorMessage
                }
            }

            return {
                error: false,
                animal: animalDoc
            }

        } catch (e) {
            return {
                error: true,
                errorMessage: e.message,
            }
        }

    }


    async updateAnimalDoc(updateOptions: UpdateOptions): Promise<UpdateDBResponse> {
        try {

            const col = await this.getOrCreateCollection(this.dogsColName);
            if (!col) {
                return {
                    error: true,
                    errorMessage: `failed to get or create collection: ${this.dogsColName} in db: ${process.env.DB_PERMIETER}`,
                }
            }

            const {animal, error:dogReadError} = await this.readAnimalDoc(updateOptions.id)
            if(dogReadError){
                return {
                    error: true,
                    errorMessage: `failed to find dog by id: ${updateOptions.id} to perform update`
                }
            }

            const query = {id: updateOptions.id};

            const updatedDog = { ...animal, ...updateOptions };

            const update = {$set: updatedDog};
            const options = {upsert: false};
            await col.updateOne(query, update, options);


            return {
                error: false,
            }

        } catch (e) {
            return {
                error: true,
                errorMessage:  e.message,
            }
        }

    }


    async deleteAnimalDoc(id: string): Promise<DeleteDBResponse> {
        try {

            const col = await this.getOrCreateCollection(this.dogsColName);
            if (!col) {
                return {
                    error: true,
                    errorMessage: `failed to get or create collection: ${this.dogsColName} in db: ${process.env.DB_PERMIETER}`,
                }
            }

            const query = {id: id};

            const result = await col.deleteOne(query);

            if (result.deletedCount === 1) {
                console.log('Animal document deleted successfully');
            } else {
                const errorMessage = 'Document not found'
                return {
                    error: true,
                    errorMessage: errorMessage
                }
            }

            return {
                error: false
            }

        } catch (e) {
            return {
                error: e.message,
            }
        }

    }


    async searchAnimalDoc(searchOptions: SearchOptions): Promise<SearchDBResponse> {
        try {

            const col = await this.getOrCreateCollection(this.dogsColName);
            if (!col) {
                return {
                    error: true,
                    errorMessage:  `failed to get or create collection: ${this.dogsColName} in db: ${process.env.DB_PERMIETER}`,
                }
            }

            const {query, options} = getSearchQuery(searchOptions)

            const animals = await col.find(query, options).toArray();

            if (!animals) {
                const errorMessage = `Dogs search error`
                console.log(errorMessage);
                return {
                    error: true,
                    errorMessage:  errorMessage
                }
            }

            return {
                error: false,
                animals
            }

        } catch (e) {
            return {
                error: true,
                errorMessage:  e.message,
            }
        }

    }

    getOrCreateCollection = async (colName: string): Promise<any> => {
        let col = this.db.collection(colName);
        if (col === null) {
            col = await this.db.createCollection(colName)
        }

        return col;
    }


}


type Query = {
    age?: { $gt: number },
    color?: { $ne: string }
};

type Options = {
    sort?: { [key: string]: number }
};

const getSearchQuery = (searchOptions: SearchOptions): {query: Query, options: Options} => {
    let query: Query = {}
    let options: Options = {}

    if(searchOptions.ageGreaterThan){
        query.age = {$gt: searchOptions.ageGreaterThan}
    }

    if(searchOptions.notColor){
        query.color = {$ne: searchOptions.notColor}
    }

    if(searchOptions.sortBy){
        options = {
            sort: {[searchOptions.sortBy]: 1} // Sort by name in ascending order
        };
    }

    return {
        query,
        options
    }
}



export default AnimalMongoDB
