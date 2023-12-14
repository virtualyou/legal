
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
 * doc.controller.ts
 */

import db from '../models';
import { Request, Response } from 'express';
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

const getAllDocs = (_req: Request, res: Response) => {
    Doc.findAll()
        .then((data: DocType) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, _req, res);
        });
};

const getAllDocsForOwner = (req: Request, res: Response) => {

    Doc.findAll({
            where: {
                userKey: getWhereKey(req),
            },
        }
    )
        .then((data: DocType) => {
            res.send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const getDoc = (req: Request, res: Response) => {
    const id = req.params['id'];

    Doc.findByPk(id)
        .then((data: DocType) => {
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

const getDocForOwner = (req: Request, res: Response) => {
    const id = req.params['id'];

    Doc.findOne({
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    })
        .then((data: DocType) => {
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

const createDocForOwner = (req: Request, res: Response) => {
    // Check request
    if (!req.body.name) {
        res.status(400).send({
            message: "Bad Request, name cannot be empty!"
        });
        return;
    }

    // Create new Doc object
    const doc = {
        name: req.body.name,
        phone1: req.body.phone1 || "",
        phone2: req.body.phone2 || "",
        email: req.body.email || "",
        address: req.body.address || "",
        note: req.body.note || "",
        userKey: getWhereKey(req)
    };

    // Create Doc using Sequelize
    Doc.create(doc)
        .then((data: DocType) => {
            res.status(201).send(data);
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
};

const updateDoc = (req: Request, res: Response) => {
    const id = req.params['id'];

    Doc.update(req.body, {
        where: {
            id: id
        }
    })
        .then((num: number) => {
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

const updateDocForOwner = (req: Request, res: Response) => {
    const id = req.params['id'];

    Doc.update(req.body, {
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    })
        .then((num: number) => {
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

const deleteDoc = (req: Request, res: Response) => {
    // url parameter
    const id = req.params['id'];

    // delete specific record
    Doc.destroy({
        where: {
            id: id
        }
    })
        .then((num: number) => {
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

const deleteDocForOwner = (req: Request, res: Response) => {
    // url parameter
    const id = req.params['id'];

    // delete specific record
    Doc.destroy({
        where: {
            id: id,
            userKey: getWhereKey(req)
        }
    }).then((num: number) => {
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

const deleteAllDocs = (_req: Request, res: Response) => {

    Doc.destroy({
        where: {},
        truncate: false
    })
        .then((nums: number) => {
            res.status(200).send({ message: `${nums} Docs were deleted successfully!` });
        })
        .catch((err: ExpressError) => {
            errorHandler(err, _req, res);
        });
}

const deleteAllDocsForOwner = (req: Request, res: Response) => {
    Doc.destroy({
        where: {userKey: getWhereKey(req)},
        truncate: false
    })
        .then((nums: number) => {
            res.status(200).send({ message: `${nums} Docs were deleted successfully!` });
        })
        .catch((err: ExpressError) => {
            errorHandler(err, req, res);
        });
}

const getWhereKey = (req: Request) => {
    let key: number;
    const user: number  =  parseInt(req.userId);
    const owner: number = parseInt(req.ownerId);

    if (owner === 0) {
        key = user;
        console.log("key " + user);
        return key;
    } else {
        key = owner;
        console.log("bastard key " + owner);
        return key;
    }
}

const docController = {
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
export default docController;

