import {
    Animal, CreateDBResponse,
    DBErrorStatus, DeleteDBResponse,
    Dog,
    ReadDBResponse,
    SearchDBResponse,
    SearchOptions,
    UpdateDBResponse,
    UpdateOptions
} from "./types";
import mysql from 'mysql2/promise';
import {IAnimalDB} from "./iAnimalDB";
import url from 'url';


const dogsTableName = "dogs"



class AnimalMySQL implements IAnimalDB{
    connection: mysql.Connection | any = null;

    async initDB() {
        await this.connect();
        await this.createAnimalsTables();
    }

    async connect() {
        if (!this.connection) {
            const dbUrl = url.parse(process.env.MYSQL_DB_URI || 'MISSING MYSQL_DB_URI env variable, contact Animal support');
            const [username, password] = (dbUrl.auth || '').split(':');

            const dbName = dbUrl.pathname?.substring(1) || '';

            this.connection = await mysql.createConnection({
                host: dbUrl.hostname || 'MISSING MYSQL_DB_URI env variable, contact Animal support',
                user: username || 'user',
                database: dbName, // Remove leading "/"
                password: password || 'password',
            });
        }
    }

    async createAnimalsTables() {
        // Create table 'dogs' if it doesn't exist
        const createTableSql = `
            CREATE TABLE IF NOT EXISTS dogs (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                age INT NOT NULL,
                color VARCHAR(255) NOT NULL
            );
        `;

        await this.connection.execute(createTableSql);
    }

    async createAnimalDoc(animal: Animal): Promise<CreateDBResponse> {
        try {
            const { id, name, age, color } = animal;
            const query = `
            INSERT INTO ${dogsTableName} (id, name, age, color) 
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE name = ?, age = ?, color = ?;
        `;

            await this.connection.execute(
                query,
                [id, name, age, color, name, age, color]
            );

            return { error: false }
        } catch (e) {
            return {
                error: true,
                errorMessage:  e.message,
            }
        }
    }


    async readAnimalDoc(id: string): Promise<ReadDBResponse> {
        try {

            const [rows]: any = await this.connection.execute(
                `SELECT * FROM ${dogsTableName} WHERE id = ?`,
                [id]
            );

            if (rows.length === 0) {
                return {
                    error: true,
                    errorMessage:  `Animal document by id: ${id} couldnt be found`
                }
            }

            return {
                error: false,
                animal: rows[0]
            }

        } catch (e) {
            return {
                error: true,
                errorMessage:  e.message,
            }
        }
    }

    async updateAnimalDoc(updateOptions: UpdateOptions): Promise<UpdateDBResponse> {
        try {

            const {animal, error:dogReadError} = await this.readAnimalDoc(updateOptions.id)
            if(dogReadError){
                return {
                    error: true,
                    errorMessage:  `failed to find dog by id: ${updateOptions.id} to perform update`
                }
            }

            const updatedDog = { ...animal, ...updateOptions };

            await this.connection.execute(
                `UPDATE ${dogsTableName} SET name = ?, age = ?, color = ? WHERE id = ?`,
                [updatedDog.name, updatedDog.age, updatedDog.color, updatedDog.id]
            );

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
            await this.connect();

            const [rows] = await this.connection.execute(
                `DELETE FROM ${dogsTableName} WHERE id = ?`,
                [id]
            );

            if (rows.affectedRows === 0) {
                return {
                    error: true,
                    errorMessage:  'Document not found'
                }
            }

            return { error: false }

        } catch (e) {
            return {
                error: true,
                errorMessage:  e.message,
            }
        }
    }

    async searchAnimalDoc(searchOptions: SearchOptions): Promise<SearchDBResponse> {
        try {
            const {params, whereClause, orderBy} = getSearchQuery(searchOptions)

            const [rows]: any = await this.connection.execute(
                `SELECT * FROM ${dogsTableName} ${whereClause} ${orderBy}`,
                params
            );

            if (!rows) {
                return {
                    error: true,
                    errorMessage:  'Dogs search error'
                }
            }

            const animals: Animal[] = rows

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
}



const getSearchQuery = (searchOptions: SearchOptions) : {params: (string | number)[], whereClause: string, orderBy: string} => {

    let whereClause = '';
    let params: (string | number)[] = [];

    if(searchOptions.ageGreaterThan){
        whereClause += `AND age > ? `;
        params.push(searchOptions.ageGreaterThan);
    }

    if(searchOptions.notColor){
        whereClause += `AND color != ? `;
        params.push(searchOptions.notColor);
    }

    if(whereClause.length > 0) {
        whereClause = 'WHERE ' + whereClause.slice(4);
    }

    const validSortOptions = ['name','age', 'color']; // valid sort options

    let orderBy = '';
    if(searchOptions.sortBy){
        if (validSortOptions.includes(searchOptions.sortBy)) {
            orderBy = `ORDER BY ${searchOptions.sortBy}`;
        } else {
            throw new Error('Invalid sort option - the animal corporation doesnt allow sql injection');
        }
    }

    return {
        params,
        whereClause,
        orderBy
    }
}

export default AnimalMySQL;
