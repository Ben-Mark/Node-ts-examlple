process.env.NODE_ENV='dev'
process.env.NODE_NO_WARNINGS='1'
process.env.LOG_LEVEL='info'
process.env.SYSTEM_UNDER_TEST='true'
import {expect, reportLog, request} from "../setup/baseApiTest";
import {Animal, Cat} from "../../orm/types";
const {describe, it} = require('mocha');
import { Context } from "mocha";

import {createApp} from "../../app";


function runTest(testName: string, dbType: string, port: number) {


    describe(testName, function (this: Context) {

        this.timeout(0)

        process.env.DB_TYPE = dbType
        let catId = ""
        let app: any

        it('Should wait until server is up', async function (this: Context) {
            reportLog.call(this,'text message..')
            app = await createApp(port)
        })

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

            const createdCat: Cat = response.body.data
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

            const createdCat: Cat = readResponse.body.data
            expect(createdCat.color).toEqual("red");

        });



    })
}

describe('Test suite', function() {
    runTest('CRUD Animal Test with mongoDB', 'mongodb', 3007);
});
