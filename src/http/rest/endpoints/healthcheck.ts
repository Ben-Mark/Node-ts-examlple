import { Request, Response } from 'express';
import {ErrorResponse, SuccessEmptyResponse} from "../types";




type SuccessResponse = SuccessEmptyResponse & {
    data: string
};

interface ReadResponse extends Response {
    json(data: SuccessResponse | ErrorResponse): this;
}


export default async (req: Request, res: ReadResponse) => {

    try{
        res.type('application/json')

        res.status(200).send({
            error: false,
            data: "Server is UP!"
        })

    } catch (e){
        console.log(e);
        res.status(500).send({
            error: e.message
        })
    }

}


