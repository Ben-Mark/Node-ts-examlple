import { Animal, Dog, SearchOptions, UpdateOptions } from "./types";
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

            this.connection = await mysql.createConnection({
                host: dbUrl.hostname || 'MISSING MYSQL_DB_URI env variable, contact Animal support',
                user: username || 'user',
                database: (dbUrl.pathname || '').substr(1), // Remove leading "/"
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
                age VARCHAR(255) NOT NULL,
                color VARCHAR(255) NOT NULL
            );
        `;

        await this.connection.execute(createTableSql);
    }

    async createAnimalDoc(animal: Animal): Promise<{ error: boolean | string }> {
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
                error: e.message,
            }
        }
    }

    async deleteAnimalDoc(id: string): Promise<{ error: boolean | string }> {
        try {
            await this.connect();

            const [rows] = await this.connection.execute(
                `DELETE FROM ${dogsTableName} WHERE id = ?`,
                [id]
            );

            if (rows.affectedRows === 0) {
                return { error: 'Document not found' }
            }

            return { error: false }

        } catch (e) {
            return {
                error: e.message,
            }
        }
    }

    async readAnimalDoc(id: string): Promise<{ dog?: Dog, error: boolean | string }> {
        try {

            const [rows]: any = await this.connection.execute(
                `SELECT * FROM ${dogsTableName} WHERE id = ?`,
                [id]
            );

            if (rows.length === 0) {
                return { error: `Animal document by id: ${id} couldnt be found` }
            }

            return {
                error: false,
                dog: rows[0]
            }

        } catch (e) {
            return {
                error: e.message,
            }
        }
    }

    async updateAnimalDoc(updateOptions: UpdateOptions): Promise<{ error: boolean | string }> {
        try {

            const {dog, error:dogReadError} = await this.readAnimalDoc(updateOptions.id)
            if(dogReadError){
                return {
                    error: `failed to find dog by id: ${updateOptions.id} to perform update`
                }
            }

            const updatedDog = { ...dog, ...updateOptions };

            await this.connection.execute(
                `UPDATE ${dogsTableName} SET name = ?, age = ?, color = ? WHERE id = ?`,
                [updatedDog.name, updatedDog.age, updatedDog.color, updatedDog.id]
            );

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

            let whereClause = '';
            let params: any[] = [];

            if(searchOptions.age){
                whereClause += `AND age > ? `;
                params.push(searchOptions.age);
            }

            if(searchOptions.notColor){
                whereClause += `AND color != ? `;
                params.push(searchOptions.color);
            }

            if(whereClause.length > 0) {
                whereClause = 'WHERE ' + whereClause.slice(4);
            }

            let orderBy = '';
            if(searchOptions.sortBy){
                orderBy = `ORDER BY ${searchOptions.sortBy}`;
            }

            const [rows]: any = await this.connection.execute(
                `SELECT * FROM ${dogsTableName} ${whereClause} ${orderBy}`,
                params
            );

            if (!rows || rows.length === 0) {
                return { error: 'Dogs search error' }
            }

            return {
                error: false,
                dogs: rows
            }

        } catch (e) {
            return {
                error: e.message,
            }
        }
    }
}

export default AnimalMySQL;
