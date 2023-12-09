import express, { type Express } from 'express';
//import * as express from 'express'
//import { Router, Request, Response, NextFunction } from 'express'
import cors from 'cors';
import * as dotenv from 'dotenv';
//import { initRoutes } from './routes/doc.routes';
//const init = process.argv.includes('--init=true');
import docs from './routes/docs';

const app: Express = express();

dotenv.config();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
//const db = require("./src/models");
import db from './models/index';

const Doc = db.doc;

//if (init) {
    db.sequelize.sync({force: true}).then(() => {
        console.log('Drop and Resync Db');
        initial();
    });
//} else {
//    db.sequelize.sync();
//}

//app.get("/", (_req, res) => {
//    res.json({ message: "Welcome to the VirtualYou Legal API." });
//});

// routes
//initRoutes(app, app.router);
app.get('/', (_req, res) => {
    res.send('hello world')
})

app.use('/', docs);

function initial() {
    Doc.create({
        name: "Last Will and Testament",
        type: "Google Drive",
        link: "https://drive.google.com/file/d/1RlBpKPUWtAagUz5RjaAFmFLu6PW9F-8o/view?usp=drive_link",
        userKey: 7,
    });

    Doc.create({
        name: "Health Care Directive",
        type: "Google Drive",
        link: "https://drive.google.com/file/d/1jdCdPD23QS2_L9WJqUKGl9A551PfxmSS/view?usp=drive_link",
        userKey: 7,
    });
}

export default app;