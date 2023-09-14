const express = require('express')
require('./config')
const bodyParser = require('body-parser')
const {createServer} = require('http')
import router from "./http/rest";
import {DBFactory} from "./orm/iAnimalDB";



process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

let httpServer: any
let app: any


const createApp = async (port?: number) =>{

    app = express()

    const cors = require('cors');


    app.use(cors());
    app.use(bodyParser.json())


    const animalDB = DBFactory.createDB()
    await animalDB.initDB().catch((err: any) => {
        console.error(err);
        terminate()
    })
    app.set('animalDB', animalDB)


    httpServer = createServer(app)

    if(!port && !process.env.HTTP_PORT){
        throw new Error("no port was defined, aborting.")
    }
    // @ts-ignore
    const httpPort = port ?? parseInt(process.env.HTTP_PORT);

    httpServer.listen(httpPort, '0.0.0.0', () => {
        console.log(`Animal interview server listening on port: ${httpPort}`)
    })

    app.use('/', router)

    app.set('etag', false)

    process.on('uncaughtException', function (err) {
        console.error(err);
    })

    return app

}


//this convention is for testing purposes...
const isApiTestMode = JSON.parse(process.env.SYSTEM_UNDER_TEST || "false")
if(!isApiTestMode){
    (async () => {
        await createApp();
    })();
}


const terminate = () => {
    httpServer.close((err: any) => {
        console.log('Http server terminated.');
        process.exit(err ? 1 : 0);
    });
}

export {
    createApp,
    terminate
}
