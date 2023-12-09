/*
 *
 * VirtualYou Project
 * Copyright 2023 David L Whitehurst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * docs.ts
 */

import authJwt from '../utility/authJwt';
import {NextFunction, Request, Response} from "express";
import db from '../models';

import express from 'express';

const router = express.Router()
const Doc = db.doc;

class ExpressError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ExpressError';
    }
}

const errorHandler = (err: ExpressError, _req: Request, res: Response) => {
    console.error(err.stack);
    res.status(500).send('Internal server error');
};


router.use((_req: Request, res: Response, next: NextFunction) => {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    );
    next();
});

router.get("/legal/v1/owner/docs", (req: Request, res: any, next: any) => {
    authJwt.verifyToken(req, res, next); //, authJwt.isOwnerOrAgentOrMonitor],
    let key = 7; //-1;
    /*
    if (req.ownerId === 0) {
            console.log("ownerId " + req.ownerId);
            key = req.userId;
    } else {
            key = req.ownerId;
            console.log("ownerId " + req.ownerId);
    }
    */
    Doc.findAll({
                where: {
                    userKey: key,
                },
    }).then((data: any) => {
                res.send(data);
    }).catch((err: ExpressError) => {
                errorHandler(err, req, res);
    });
});
export default router;
//module.exports = router