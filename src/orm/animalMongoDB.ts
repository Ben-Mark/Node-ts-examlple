import {
    Animal,
    Dog,
    SearchOptions, UpdateOptions,
} from "./types";
import {IAnimalDB} from "./iAnimalDB";

const {MongoClient} = require('mongodb')


class AnimalMongoDB implements IAnimalDB{

    dbUri: string
    dbName: string
    dogsColName: string
    client: any
    db: any

    constructor() {
        this.dbName = process.env["DB_PERMIMETER"] || "Error, missing DB NAME, Call animal support"
        this.dogsColName = "dogs-col"
        this.dbUri = process.env["MONGO_DB_URI"] || "Error, missing DB URI, Call animal support"
    }

    initDB = async () => {
        try{
            this.client = await MongoClient.connect(this.dbUri, {useNewUrlParser: true});
            this.db = this.client.db(this.dbName);
            await this.getOrCreateCollection(this.dogsColName);
            console.log(`${this.dbName} DB initialized`);
        }catch(e){
            console.error(e.message)
            throw new Error(e)
        }
    }

    async createAnimalDoc(animal: Animal): Promise<{ error: boolean | string }> {
        try {

            const col = await this.getOrCreateCollection(this.dogsColName);
            if (!col) {
                return {
                    error: `failed to get or create collection: ${this.dogsColName} in db: ${process.env.DB_PERMIETER}`,
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
                error: e.message,
            }
        }

    }


    async deleteAnimalDoc(id: string): Promise<{ error: boolean | string }> {
        try {

            const col = await this.getOrCreateCollection(this.dogsColName);
            if (!col) {
                return {
                    error: `failed to get or create collection: ${this.dogsColName} in db: ${process.env.DB_PERMIETER}`,
                }
            }

            const query = {id: id};

            const result = await col.deleteOne(query);

            if (result.deletedCount === 1) {
                console.log('Animal document deleted successfully');
            } else {
                const errorMessage = 'Document not found'
                return {
                    error: errorMessage
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


    async readAnimalDoc(id: string): Promise<{ dog?: Dog, error: boolean | string }> {
        try {

            const col = await this.getOrCreateCollection(this.dogsColName);
            if (!col) {
                return {
                    error: `failed to get or create collection: ${this.dogsColName} in db: ${process.env.DB_PERMIETER}`,
                }
            }

            const query = {id: id};


            const dogDoc: Dog = await col.findOne(query);

            if (!dogDoc) {
                const errorMessage = `Animal document by id: ${id} couldnt be found`
                console.log(errorMessage);
                return {
                    error: errorMessage
                }
            }

            return {
                error: false,
                dog: dogDoc
            }

        } catch (e) {
            return {
                error: e.message,
            }
        }

    }


    async updateAnimalDoc(updateOptions: UpdateOptions): Promise<{ error: boolean | string }> {
        try {

            const col = await this.getOrCreateCollection(this.dogsColName);
            if (!col) {
                return {
                    error: `failed to get or create collection: ${this.dogsColName} in db: ${process.env.DB_PERMIETER}`,
                }
            }

            const {dog, error:dogReadError} = await this.readAnimalDoc(updateOptions.id)
            if(dogReadError){
                return {
                    error: `failed to find dog by id: ${updateOptions.id} to perform update`
                }
            }

            const query = {id: updateOptions.id};

            const updatedDog = { ...dog, ...updateOptions };

            const update = {$set: updatedDog};
            const options = {upsert: false};
            await col.updateOne(query, update, options);


            return {
                error: false,
            }

        } catch (e) {
            return {
                error: e.message,
            }
        }

    }


    async searchAnimalDoc(searchOptions: SearchOptions): Promise<{ dogs?: Dog[], error: boolean | string }> {
        try {

            const col = await this.getOrCreateCollection(this.dogsColName);
            if (!col) {
                return {
                    error: `failed to get or create collection: ${this.dogsColName} in db: ${process.env.DB_PERMIETER}`,
                }
            }

            let query: any = {}
            let options: any = {}

            if(searchOptions.age){
                query.age = {$gt: searchOptions.age}
            }

             if(searchOptions.notColor){
                query.color = {$ne: searchOptions.color}
            }

            if(searchOptions.sortBy){
                options = {
                    sort: {[searchOptions.sortBy]: 1} // Sort by name in ascending order
                };
            }


            const dogs = await col.find(query, options).toArray();

            if (!dogs) {
                const errorMessage = `Dogs search error`
                console.log(errorMessage);
                return {
                    error: errorMessage
                }
            }

            return {
                error: false,
                dogs
            }

        } catch (e) {
            return {
                error: e.message,
            }
        }

    }

    getOrCreateCollection = async (colName: string): Promise<any> => {
        let col = this.db.collection(colName);
        if (col === null) {
            col = await this.db.createCollection(colName)
            // const indexDoc = {
            //     name: "index",
            // }
            // await col.insertOne(indexDoc)
        }

        return col;
    }


}



export default AnimalMongoDB
