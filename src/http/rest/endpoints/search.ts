import { SearchOptions} from "../../../orm/types";
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {

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


