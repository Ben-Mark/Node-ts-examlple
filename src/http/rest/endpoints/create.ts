import axios from 'axios'
import {AnimalInput, Dog} from "../../../orm/types";
import { Request, Response } from 'express';
import {ErrorResponse, SuccessIdResponse} from "../types";


interface CreateResponse extends Response {
    json(data: SuccessIdResponse | ErrorResponse): this;
}

interface CreateRequest extends Request {
    body: AnimalInput;
}

export default async (req: CreateRequest, res: CreateResponse) => {

    try{
        res.type('application/json')

        const animalDB = req.app.get('animalDB')

        const body = req.body

        let animalInput: AnimalInput = body

        const dog = new Dog(animalInput)

        const { error } = await animalDB.createAnimalDoc(dog)

        if(error){
            throw new Error(error)
        }

        res.status(200).send({
            error: false,
            data: {
                id: dog.id
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


