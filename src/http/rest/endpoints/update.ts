import { UpdateOptions} from "../../../orm/types";
import { Request, Response } from 'express';
import {ErrorResponse, SuccessEmptyResponse} from "../types";


interface UpdateResponse extends Response {
    json(data: SuccessEmptyResponse | ErrorResponse): this;
}

interface UpdateRequest extends Request {
    body: UpdateOptions;
}


export default async (req: UpdateRequest, res: UpdateResponse) => {

    try{
        res.type('application/json')

        const animalDB = req.app.get('animalDB')

        const body = req.body

        const updateOptions: UpdateOptions = body

        const { error } = await animalDB.updateAnimalDoc(updateOptions)

        if(error){
            throw new Error(error)
        }

        res.status(200).send({
            error: false,
        })

    } catch (e){
        console.log(e);
        res.status(500).send({
            error: e.message
        })
    }

}


