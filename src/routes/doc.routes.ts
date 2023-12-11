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
 * doc.routes.ts
 */

import { NextFunction, Request, Response } from "express";
import docController from "../controllers/doc.controller";
import authJwt from '../utility/authJwt';
import express from 'express';

const docRouter = express();

docRouter.use((_req: Request, res: Response, next: NextFunction) => {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    );
    next();
});

docRouter.get(
    "/legal/v1/owner/docs",
    [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
    docController.getAllDocsForOwner
);

export default docRouter;
