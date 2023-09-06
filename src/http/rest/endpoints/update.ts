import { UpdateDBResponse, UpdateOptions} from "../../../orm/types";
import { Request, Response } from 'express';
import {ErrorResponse, SuccessEmptyResponse} from "../types";



interface UpdateRequest extends Request {
    body: UpdateOptions;
}

interface UpdateResponse extends Response {
    json(data: SuccessEmptyResponse | ErrorResponse): this;
}

export default async (req: UpdateRequest, res: UpdateResponse) => {

    try{
        res.type('application/json')

        const animalDB = req.app.get('animalDB')

        const updateOptions: UpdateOptions = req.body

        const updateDBResponse: UpdateDBResponse = await animalDB.updateAnimalDoc(updateOptions)

        if(updateDBResponse.error){
            throw new Error(updateDBResponse.errorMessage)
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


