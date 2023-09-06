import { Request, Response } from 'express';
import {ErrorResponse, SuccessEmptyResponse} from "../types";
import {DeleteDBResponse} from "../../../orm/types";



interface DeleteRequest extends Request {
    body: { id: string };
}


interface DeleteResponse extends Response {
    json(data: SuccessEmptyResponse | ErrorResponse): this;
}


export default async (req: DeleteRequest, res: DeleteResponse) => {

    try{
        res.type('application/json')

        const animalDB = req.app.get('animalDB')

        const body = req.body

        const {id}:{ id: string } = body

        const deleteDBResponse: DeleteDBResponse = await animalDB.deleteAnimalDoc(id)

        if(deleteDBResponse.error){
            throw new Error(deleteDBResponse.errorMessage)
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


