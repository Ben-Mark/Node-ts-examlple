process.env.NODE_ENV
    ? require('dotenv').config({path: `.env.${process.env.NODE_ENV}`})
    : require('dotenv').config()
