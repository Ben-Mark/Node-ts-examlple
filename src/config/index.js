process.env.NODE_NO_WARNINGS='1'
process.env.LOG_LEVEL='info'

if(!process.env.NODE_ENV){
    process.env.NODE_ENV='dev'
}
require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})
