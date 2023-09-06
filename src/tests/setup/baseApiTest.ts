process.env.NODE_ENV='dev'
process.env.SYSTEM_UNDER_TEST = 'true';
const request = require('supertest');
import { Context } from 'mocha';
import expect from 'expect'


const addContext = require('mochawesome/addContext');


const mochawesomeErrorMessage= "mocha awesome error, you must call reportLog with reportLog.call(this, 'text message..') , you forgot to add this or invoke reportLog or reportError with .call , e.g. reportLog.call(this,'..') "

function reportLog(this: Context, object: any) {
    // @ts-ignore
    if(!this._runnable || this._runnable.type !== 'test'){
        throw new Error(mochawesomeErrorMessage)
    }
    console.log(object);
    addContext(this, object);
}

function reportError(this: Context,object: any){
    // @ts-ignore
    if(!this._runnable || this._runnable.type !== 'test'){
        throw new Error(mochawesomeErrorMessage)
    }
    console.error(object);
    addContext(this, object);
}

export {
    request,
    expect,
    reportLog,
    reportError,
}
