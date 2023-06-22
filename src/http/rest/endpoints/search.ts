import {Animal, SearchOptions} from "../../../orm/types";
import { Request, Response } from 'express';
import {ErrorResponse, SuccessEmptyResponse} from "../types";


type SuccessResponse = SuccessEmptyResponse & {
    data: Animal[]
};

interface SearchResponse extends Response {
    json(data: SuccessResponse | ErrorResponse): this;
}

interface SearchRequest extends Request {
    body: SearchOptions;
}


export default async (req: SearchRequest, res: SearchResponse) => {

    try{
        res.type('application/json')

        const animalDB = req.app.get('animalDB')

        const body = req.body

        let searchOptions: SearchOptions = body

        const { error, animals } = await animalDB.searchAnimalDoc(searchOptions)

        if(error){
            throw new Error(error)
        }

        res.status(200).send({
            error: false,
            data: animals
        })

    } catch (e){
        console.log(e);
        res.status(500).send({
            error: e.message
        })
    }

}


