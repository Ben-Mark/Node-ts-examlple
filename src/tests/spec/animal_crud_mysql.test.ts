import {expect, request} from "../setup/baseApiTest";
import {Animal, Dog} from "../../orm/types";
const {describe, it} = require('mocha');
process.env.DB_TYPE = "mysql"

import {createApp} from "../../app";



describe('CRUD Animal Test with MySQL',  function () {

    // @ts-ignore
    this.timeout(0)

    let dogId = ""
    let app: any

    it('Should wait until server is up', async () => {
        app = await createApp(3008)
    })

    it('Should create a new dog', async () => {
        const dogData = {
            name: "Rex",
            age: 2,
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
        expect(createdDog.name).toBe("Rex");
        expect(createdDog.age).toBe(2);
        expect(createdDog.color).toBe("Brown");
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

    it('Should search for a dog by age and not color from db', async () => {

        const brownSearchResponse = await request(app).post('/search').send({
            ageGreaterThan: 2,
            notColor: "Brown",
            sortBy: "name"
        });

        expect(brownSearchResponse.status).toEqual(200);
        expect(brownSearchResponse.body.error).toBeFalsy();

        const brownAnimals: Animal [] = brownSearchResponse.body.data
        expect(brownAnimals).toEqual([])


        const redSearchResponse = await request(app).post('/search').send({
            ageGreaterThan: 1,
            color: "red",
            sortBy: "name"
        });

        expect(redSearchResponse.status).toEqual(200);
        expect(redSearchResponse.body.error).toBeFalsy();

        const redAnimals: Animal [] = redSearchResponse.body.data
        expect(redAnimals[0].name).toBe("Rex");
        expect(redAnimals[0].age).toBe(2);
        expect(redAnimals[0].color).toBe("red");
    });


    it('Should delete the new dog created from db', async () => {
        const dogData = {
            id: dogId
        };

        const response = await request(app).post('/delete').send(dogData);

        expect(response.status).toEqual(200);
        expect(response.body.error).toBeFalsy();

    });



})
