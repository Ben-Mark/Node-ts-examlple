import {expect, request} from "../setup/baseApiTest";
import { Dog } from "../../orm/types";
const {describe, it} = require('mocha');
process.env.DB_TYPE = "mysql"

import {createApp,terminate} from "../../app";



describe('CRUD Animal Test with MySQL',  function () {

    // @ts-ignore
    this.timeout(0)

    let dogId = ""
    let app: any

    it('Should wait until server is up', async () => {
        app = await createApp()
    })

    it('Should create a new dog', async () => {
        const dogData = {
            name: "Rex",
            age: "2",
            color: "Brown"
        };

        const response = await request(app).post('/create').send(dogData);

        expect(response.status).toEqual(200);
        expect(response.body.error).toBeFalsy();

        dogId = response.body.data.id

    });


    it('Should read the new dog created from db', async () => {
        const dogData = {
            id: dogId
        };

        const response = await request(app).post('/read').send(dogData);

        expect(response.status).toEqual(200);
        expect(response.body.error).toBeFalsy();

        const createdDog: Dog = response.body.data
        console.log(createdDog);
    });

    it('Should update the new dog created from db', async () => {
        const dogData = {
            id: dogId
        };

        const updateResponse = await request(app).post('/update').send({
            id: dogData.id,
            color: "red"
        });

        expect(updateResponse.status).toEqual(200);
        expect(updateResponse.body.error).toBeFalsy();


        const readResponse = await request(app).post('/read').send(dogData);

        expect(readResponse.status).toEqual(200);
        expect(readResponse.body.error).toBeFalsy();

        const createdDog: Dog = readResponse.body.data
        expect(createdDog.color).toEqual("red");

    });


    it('Should delete the new dog created from db', async () => {
        const dogData = {
            id: dogId
        };

        const response = await request(app).post('/delete').send(dogData);

        expect(response.status).toEqual(200);
        expect(response.body.error).toBeFalsy();

    });


    after(() => {
        terminate()
    });


})
