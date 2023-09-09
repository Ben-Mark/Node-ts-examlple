import axios from 'axios'
import {AnimalInput, CreateDBResponse, Animal} from "../../../orm/types";
import { Request, Response } from 'express';
import {ErrorResponse, SuccessIdResponse} from "../types";



interface CreateRequest extends Request {
    body: AnimalInput;
}


interface CreateResponse extends Response {
    json(data: SuccessIdResponse | ErrorResponse): this;
}


export default async (req: CreateRequest, res: CreateResponse) => {

    try{
        res.type('application/json')

        const animalDB = req.app.get('animalDB')

        let animalInput: AnimalInput = req.body

        const cat = new Animal(animalInput)

        const createDBResponse: CreateDBResponse = await animalDB.createAnimalDoc(cat)

        if(createDBResponse.error){
            throw new Error(createDBResponse.errorMessage)
        }

        res.status(200).send({
            error: false,
            data: {
                id: cat.id
            }
        })

    } catch (e){
        console.log(e);
        res.status(500).send({
            error: e.message,
            data: false
        })
    }

}


