import {Animal, DBErrorStatus, SearchDBResponse, SearchOptions} from "../../../orm/types";
import { Request, Response } from 'express';
import {ErrorResponse, SuccessEmptyResponse} from "../types";


interface SearchRequest extends Request {
    body: SearchOptions;
}

type SuccessResponse = SuccessEmptyResponse & {
    data: Animal[]
};

interface SearchResponse extends Response {
    json(data: SuccessResponse | ErrorResponse): this;
}


export default async (req: SearchRequest, res: SearchResponse) => {

    try{
        res.type('application/json')

        const animalDB = req.app.get('animalDB')

        let searchOptions: SearchOptions = req.body

        const searchDBResponse: SearchDBResponse = await animalDB.searchAnimalDoc(searchOptions)

        if(searchDBResponse.error){
            throw new Error(searchDBResponse.errorMessage)
        }

        res.status(200).send({
            error: false,
            data: searchDBResponse.animals
        })

    } catch (e){
        console.log(e);
        res.status(500).send({
            error: e.message
        })
    }

}


