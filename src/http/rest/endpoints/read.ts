import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {

    try{
        res.type('application/json')

        const animalDB = req.app.get('animalDB')

        const body = req.body

        const {id}:{ id: string } = body

        const {error, animal } = await animalDB.readAnimalDoc(id)

        if(error){
            throw new Error(error)
        }

        res.status(200).send({
            error: false,
            data: animal
        })

    } catch (e){
        console.log(e);
        res.status(500).send({
            error: e.message
        })
    }

}


