import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {

    try{
        res.type('application/json')

        const animalDB = req.app.get('animalDB')

        const body = req.body

        const {id}:{ id: string } = body

        const {error } = await animalDB.deleteAnimalDoc(id)

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


