import express  from 'express';
import bodyParser from 'body-parser';
import routes from "../app/routes"
import morgan from 'morgan';
import cors from 'cors';
import boom from 'express-boom';
module.exports = function(){
    var app = express();
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(cors());
    app.use(boom());
    app.use(morgan('tiny'));
    app.use('/', routes);
    return app;
};