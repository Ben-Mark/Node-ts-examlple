import axios from 'axios'
import {AnimalInput, Dog, SearchOptions} from "../../../orm/types";
/**
 * once this endpoint is called
 * this server searches for the registered ws event 'public-ssh-key-arrived'
 * and emits that to all registered sockets
 *
 */

export default async (req: any, res: any) => {

    try{
        res.type('application/json')

        const animalDB = req.app.get('animalDB')

        const body = req.body

        let searchOptions: SearchOptions = body

        const { error } = await animalDB.searchAnimalDoc(searchOptions)

        if(error){
            res.status(400).send({
                error,
            })
            return
        }

        res.status(200).send({
            error: false,
        })

    } catch (e){
        console.log(e);
        res.status(400).send({
            error: e.message
        })
    }

}


