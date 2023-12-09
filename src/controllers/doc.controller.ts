
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
 */

import db from '../models';
import { Request, Response } from 'express';
import logger from "../middleware/logger";
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

/**
 * This asynchronous controller function returns a list of all Docs.
 * The function here would only be called by ROLE_ADMIN
 *
 * @param {object} _req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return all Doc objects
 */

const getAllDocs = (_req: Request, res: Response) => {
    Doc.findAll()
        .then((data: any) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, _req, res);
        });
};

/**
 * This asynchronous controller function returns a list of
 * Docs specifically belonging to the Owner.
 *
 * The function here can be called by ROLE_OWNER, ROLE_AGENT, ROLE_MONITOR
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Doc objects
 */

const getAllDocsForOwner = (req: any, res: Response) => {
    logger.log('info', `We are in controller but ...req.ownerId: ` + req.ownerId);

    let key = -1;
    if (req.ownerId === 0) {
        console.log("ownerId " + req.ownerId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("ownerId " + req.ownerId);
    }

    Doc.findAll({
            where: {
                userKey: key,
            },
        }
    )
        .then((data: any) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

/**
 * This controller function returns a Doc
 * based on it's primary key or id.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Doc object
 */

const getDoc = (req: any, res: Response) => {
    const id = req.params.id;

    Doc.findByPk(id)
        .then((data: any) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Doc with id=${id}.`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

/**
 * This controller function returns a Doc
 * based on it's id and ONLY IF the Doc belongs to the
 * Owner.
 *
 * The function here would only be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Doc object
 */

const getDocForOwner = (req: any, res: Response) => {
    const id = req.params.id;
    let key = -1;
    if (req.ownerId === 0) {
        console.log("ownerId " + req.ownerId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("ownerId " + req.ownerId);
    }

    Doc.findOne({
        where: {
            id: id,
            userKey: key
        }
    })
        .then((data: any) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `May not belong to Owner or cannot find this Doc with id=${id}.`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

/**
 * This controller function creates a Doc
 *
 * The function here can be called by ROLE_OWNER and
 * ROLE_AGENT
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Promise Return
 */
const createDocForOwner = (req: any, res: Response) => {
    let key = -1;
    // Check request
    if (!req.body.name) {
        res.status(400).send({
            message: "Bad Request, name cannot be empty!"
        });
        return;
    }

    // Owner may be creating the Doc
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    // Create new Doc object
    const doc = {
        name: req.body.name,
        phone1: req.body.phone1 || "",
        phone2: req.body.phone2 || "",
        email: req.body.email || "",
        address: req.body.address || "",
        note: req.body.note || "",
        userKey: key
    };

    // Create Doc using Sequelize
    Doc.create(doc)
        .then((data: any) => {
            res.status(201).send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const updateDoc = (req: any, res: Response) => {
    const id = req.params.id;

    Doc.update(req.body, {
        where: {
            id: id
        }
    })
        .then((num: any) => {
            if (num == 1) {
                res.send({
                    message: "Doc was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Doc with id=${id} could not be found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const updateDocForOwner = (req: any, res: Response) => {
    const id = req.params.id;
    let key = -1;
    // Owner may be creating the Doc
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    Doc.update(req.body, {
        where: {
            id: id,
            userKey: key
        }
    })
        .then((num: any) => {
            if (num == 1) {
                res.send({
                    message: "Doc was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Doc with id=${id} may not belong to owner or could not be found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};


/**
 * This asynchronous controller function deletes a Doc
 * based on it's primary key or id.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

const deleteDoc = (req: any, res: Response) => {
    // url parameter
    const id = req.params.id;

    // delete specific record
    Doc.destroy({
        where: {
            id: id
        }
    })
        .then((num: any) => {
            if (num == 1) {
                return res.status(200).send({
                    message: "Doc was deleted!"
                });
            } else {
                res.status(404).send({
                    message: `Doc was not found!`
                });
            }
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

/**
 * This asynchronous controller function deletes a Doc
 * based on it's id and ONLY if it belongs to the
 * Owner.
 *
 * The function here can be called by ROLE_OWNER and
 * ROLE_AGENT.
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

const deleteDocForOwner = (req: any, res: Response) => {
    // url parameter
    const id = req.params.id;
    let key = -1;

    // if ownerId = 0 then user is owner
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    // delete specific record
    Doc.destroy({
        where: {
            id: id,
            userKey: key
        }
    }).then((num: any) => {
        if (num == 1) {
            return res.status(200).send({
                message: "Doc was deleted!"
            });
        } else {
            res.status(404).send({
                message: `Doc was not found!`
            });
        }
    })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

/**
 * This asynchronous controller function deletes all
 * Docs.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} _req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

const deleteAllDocs = (_req: Request, res: Response) => {

    Doc.destroy({
        where: {},
        truncate: false
    })
        .then((nums: any) => {
            res.status(200).send({ message: `${nums} Docs were deleted successfully!` });
        })
        .catch((err: ExpressError) => {
            errorHandler(err, _req, res);
        });
}

/**
 * This asynchronous controller function deletes all
 * Docs for the session Owner.
 *
 * The function here can be called by ROLE_OWNER and
 * ROLE_AGENT.
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

const deleteAllDocsForOwner = (req: any, res: Response) => {
    let key = -1;
    // if ownerId = 0 then user is owner
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    Doc.destroy({
        where: {userKey: key},
        truncate: false
    })
        .then((nums: any) => {
            res.status(200).send({ message: `${nums} Docs were deleted successfully!` });
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const controller = {
    getAllDocs,
    getAllDocsForOwner,
    getDoc,
    getDocForOwner,
    createDocForOwner,
    updateDoc,
    updateDocForOwner,
    deleteDoc,
    deleteDocForOwner,
    deleteAllDocs,
    deleteAllDocsForOwner
    
};
export default controller;

