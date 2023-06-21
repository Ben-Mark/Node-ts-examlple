// process.env.NODE_ENV
//     ? require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})
//     : require('dotenv').config()

process.env.NODE_ENV='dev'
process.env.SYSTEM_UNDER_TEST = 'true';
const request = require('supertest');
// const restClient = require('node-rest-client-promise');
// const nodeClientOptions = {
//     connection: {
//         rejectUnauthorized: false,
//     },
//     requestConfig: {
//         timeout: 60000,
//         noDelay: true,
//         keepAlive: true,
//         keepAliveDelay: 1000,
//     },
//     responseConfig: {
//         timeout: 300000,
//     },
// };


// import app,{terminate} from '../../app'

import expect from 'expect'


const addContext = require('mochawesome/addContext');



const mochawesomeErrorMessage= "mocha awesome error, you must call reportLog with reportLog.call(this, 'text message..') , you forgot to add this or invoke reportLog or reportError with .call , e.g. reportLog.call(this,'..') "

function reportLog(object: any) {
    // @ts-ignore
    // @ts-ignore
    // if(!this._runnable || this._runnable.type !== 'test'){
    //     // console.error("mocha awesome error, you must call reportLog with reportLog(this, 'text message..') , you forgot to add this ")
    //     throw new Error(mochawesomeErrorMessage)
    // }
    console.log(object)
    // @ts-ignore
    addContext(this, object);
}

function reportError(object: any){
    // @ts-ignore
    if(!this._runnable || this._runnable.type !== 'test'){
        // console.error("mocha awesome error, you must call reportLog with reportLog(this, 'text message..') , you forgot to add this ")
        throw new Error(mochawesomeErrorMessage)
    }
    console.error(object)
    // @ts-ignore
    addContext(this, object);
}

export {
    request,
    expect,
    reportLog,
    reportError,
}
