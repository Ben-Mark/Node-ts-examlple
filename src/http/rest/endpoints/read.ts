import { Request, Response } from 'express';
import {ErrorResponse, SuccessEmptyResponse} from "../types";
import {Animal, ReadDBResponse} from "../../../orm/types";



interface ReadRequest extends Request {
    body: { id: string };
}

type SuccessResponse = SuccessEmptyResponse & {
    data: Animal
};

interface ReadResponse extends Response {
    json(data: SuccessResponse | ErrorResponse): this;
}


export default async (req: ReadRequest, res: ReadResponse) => {

    try{
        res.type('application/json')

        const animalDB = req.app.get('animalDB')

        const body = req.body

        const {id}:{ id: string } = body

        const readDbResponse:ReadDBResponse = await animalDB.readAnimalDoc(id)

        if(readDbResponse.error){
            throw new Error(readDbResponse.errorMessage)
        }

        res.status(200).send({
            error: false,
            data: readDbResponse.animal
        })

    } catch (e){
        console.log(e);
        res.status(500).send({
            error: e.message
        })
    }

}


