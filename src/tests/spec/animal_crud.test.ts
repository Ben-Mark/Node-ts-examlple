
import {expect, reportLog, request} from "../setup/baseApiTest";
import {IAnimal} from "../../orm/types";
const {describe, it} = require('mocha');
import { Context } from "mocha";

import {createApp, terminate} from "../../app";


function runTest(testName: string, dbType: string, port?: number) {

    let app: any

    before(async function() {
        try{
            console.log('Setting up resources before all tests run.');
            if(process.env.NODE_ENV === "dev"){
                app = await createApp(port)
            }else{
                app = await createApp()
            }
        }catch(e){
            console.error(e)
        }
    });


    describe(testName, function (this: Context) {

        console.log(`Starting test suite with DB_TYPE: ${dbType}`);
        this.timeout(0)

        process.env.DB_TYPE = dbType
        let catId = ""


        it('Should receive 200 on server healthcheck', async function (this: Context) {

            const response = await request(app).get('/healthcheck');

            expect(response.status).toEqual(200);
            expect(response.body.error).toBeFalsy();

        })

        it('Should create a new cat', async function (this: Context) {
            const catData = {
                name: "Rex",
                age: 2,
                color: "Brown"
            };


            const response = await request(app).post('/create').send(catData);

            expect(response.status).toEqual(200);
            expect(response.body.error).toBeFalsy();

            catId = response.body.data.id

        });

        it('Should read the new cat created from db', async function (this: Context) {
            const catData = {
                id: catId
            };

            const response = await request(app).post('/read').send(catData);

            expect(response.status).toEqual(200);
            expect(response.body.error).toBeFalsy();

            const createdCat: IAnimal = response.body.data
            expect(createdCat.name).toBe("Rex");
            expect(createdCat.age).toBe(2);
            expect(createdCat.color).toBe("Brown");
        });

        it('Should update the new cat created from db', async () => {
            const catData = {
                id: catId
            };

            const updateResponse = await request(app).post('/update').send({
                id: catData.id,
                color: "red"
            });

            expect(updateResponse.status).toEqual(200);
            expect(updateResponse.body.error).toBeFalsy();


            const readResponse = await request(app).post('/read').send(catData);

            expect(readResponse.status).toEqual(200);
            expect(readResponse.body.error).toBeFalsy();

            const createdCat: IAnimal = readResponse.body.data
            expect(createdCat.color).toEqual("red");

        });

        it('Should search for a cat by age and not color from db', async () => {

            const brownSearchResponse = await request(app).post('/search').send({
                ageGreaterThan: 2,
                notColor: "Brown",
                sortBy: "name"
            });

            expect(brownSearchResponse.status).toEqual(200);
            expect(brownSearchResponse.body.error).toBeFalsy();


            const redSearchResponse = await request(app).post('/search').send({
                ageGreaterThan: 1,
                color: "red",
                sortBy: "name"
            });

            expect(redSearchResponse.status).toEqual(200);
            expect(redSearchResponse.body.error).toBeFalsy();

            const redAnimals: IAnimal [] = redSearchResponse.body.animals
            expect(redAnimals[0].name).toBeDefined();
        });


        it('Should delete the new cat created from db', async () => {
            const catData = {
                id: catId
            };

            const response = await request(app).post('/delete').send(catData);

            expect(response.status).toEqual(200);
            expect(response.body.error).toBeFalsy();

        });


    })



    // after() is run once after all tests end.
    after(function() {
        console.log('Cleaning up resources after all tests have run.');
        // Close
        terminate()
    })


}

describe('Test suite', function() {

    if(process.env.NODE_ENV==="production"){
        if(!process.env.DEFAULT_DB_TYPE){
            throw new Error("missing default process.env.DEFAULT_DB_TYPE: mongodb | mysql")
        }
        const dbType: string = process.env.DEFAULT_DB_TYPE
        runTest('CRUD Animal Test with mongoDB', dbType);
    }else{
        runTest('CRUD Animal Test with mongoDB', 'mongodb', 3007);
        runTest('CRUD Animal Test with MySQL', 'mysql', 3008);
    }

});
