import axios from 'axios'
import {AnimalInput, Dog} from "../../../orm/types";

export default async (req: any, res: any) => {

    try{
        res.type('application/json')

        const animalDB = req.app.get('animalDB')

        const body = req.body

        let animalInput: AnimalInput = body

        const dog = new Dog(animalInput)

        const { error } = await animalDB.createAnimalDoc(dog)

        if(error){
            throw new Error(error)
        }

        res.status(200).send({
            error: false,
            data: {
                id: dog.id
            }
        })

    } catch (e){
        console.log(e);
        res.status(400).send({
            error: e.message,
            data: false
        })
    }

}


