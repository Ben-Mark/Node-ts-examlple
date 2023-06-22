import axios from 'axios'
import {AnimalInput, Dog} from "../../../orm/types";
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

        const {id}:{ id: string } = body

        const {error, animal } = await animalDB.readAnimalDoc(id)

        if(error){
            res.status(400).send({
                error,
            })
            return
        }

        res.status(200).send({
            error: false,
            data: animal
        })

    } catch (e){
        console.log(e);
        res.status(400).send({
            error: e.message
        })
    }

}


