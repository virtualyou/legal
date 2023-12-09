
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

const db = require("../models");
const {locals} = require("express/lib/application");
const Peep = db.peep;

/**
 * This asynchronous controller function returns a list of all Peeps.
 * The function here would only be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return all Peep objects
 */

exports.getAllPeeps = (req, res) => {
    Peep.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Internal server error occurred while retrieving peeps."
            });
        });
};

/**
 * This asynchronous controller function returns a list of
 * Peeps specifically belonging to the Owner.
 *
 * The function here can be called by ROLE_OWNER, ROLE_AGENT, ROLE_MONITOR
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Peep objects
 */

exports.getAllPeepsForOwner = (req, res) => {

    if (req.ownerId === 0) {
        console.log("ownerId " + req.ownerId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("ownerId " + req.ownerId);
    }

    Peep.findAll({
            where: {
                userKey: key,
            },
        }
    )
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Internal server error occurred while retrieving peeps."
            });
        });
};

/**
 * This controller function returns a Peep
 * based on it's primary key or id.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Peep object
 */

exports.getPeep = (req, res) => {
    const id = req.params.id;

    Peep.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Peep with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error retrieving Peep with id=" + id
            });
        });
};

/**
 * This controller function returns a Peep
 * based on it's id and ONLY IF the Peep belongs to the
 * Owner.
 *
 * The function here would only be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - To return Peep object
 */

exports.getPeepForOwner = (req, res) => {
    const id = req.params.id;

    if (req.ownerId === 0) {
        console.log("ownerId " + req.ownerId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("ownerId " + req.ownerId);
    }

    Peep.findOne({
        where: {
            id: id,
            userKey: key
        }
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `May not belong to Owner or cannot find this Peep with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error retrieving Peep with id=" + id
            });
        });
};

/**
 * This controller function creates a Peep
 *
 * The function here can be called by ROLE_OWNER and
 * ROLE_AGENT
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Promise Return
 */
exports.createPeepForOwner = (req, res) => {

    // Check request
    if (!req.body.name) {
        res.status(400).send({
            message: "Bad Request, name cannot be empty!"
        });
        return;
    }

    // Owner may be creating the Peep
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    // Create new Peep object
    const peep = {
        name: req.body.name,
        phone1: req.body.phone1 || "",
        phone2: req.body.phone2 || "",
        email: req.body.email || "",
        address: req.body.address || "",
        note: req.body.note || "",
        userKey: key
    };

    // Create Peep using Sequelize
    Peep.create(peep)
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An internal server error occurred creating the Peep."
            });
        });
};

exports.updatePeep = (req, res) => {
    const id = req.params.id;

    Peep.update(req.body, {
        where: {
            id: id
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Peep was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Peep with id=${id} could not be found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error occurred while updating Peep with id=" + id
            });
        });
};

exports.updatePeepForOwner = (req, res) => {
    const id = req.params.id;

    // Owner may be creating the Peep
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    Peep.update(req.body, {
        where: {
            id: id,
            userKey: key
        }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Peep was updated successfully!"
                });
            } else {
                res.status(404).send({
                    message: `Peep with id=${id} may not belong to owner or could not be found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Internal server error occurred while updating Peep with id=" + id
            });
        });
};


/**
 * This asynchronous controller function deletes a Peep
 * based on it's primary key or id.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deletePeep = (req, res) => {
    // url parameter
    const id = req.params.id;

    // delete specific record
    Peep.destroy({
        where: {
            id: id
        }
    })
        .then(num => {
            if (num == 1) {
                return res.status(200).send({
                    message: "Peep was deleted!"
                });
            } else {
                res.status(404).send({
                    message: `Peep was not found!`
                });
            }
        })
        .catch(err => {
            return res.status(500).send({
                message: "Peep with id=" + id + " could not be deleted!"
            });
        });
}

/**
 * This asynchronous controller function deletes a Peep
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

exports.deletePeepForOwner = (req, res) => {
    // url parameter
    const id = req.params.id;

    // if ownerId = 0 then user is owner
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    // delete specific record
    Peep.destroy({
        where: {
            id: id,
            userKey: key
        }
    }).then(num => {
        if (num == 1) {
            return res.status(200).send({
                message: "Peep was deleted!"
            });
        } else {
            res.status(404).send({
                message: `Peep was not found!`
            });
        }
    })
        .catch(err => {
            return res.status(500).send({
                message: "Peep with id=" + id + " could not be deleted!"
            });
        });
}

/**
 * This asynchronous controller function deletes all
 * Peeps.
 *
 * The function here would ONLY be called by ROLE_ADMIN
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deleteAllPeeps = (req, res) => {

    Peep.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({ message: `${nums} Peeps were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while truncating peeps!"
            });
        });
}

/**
 * This asynchronous controller function deletes all
 * Peeps for the session Owner.
 *
 * The function here can be called by ROLE_OWNER and
 * ROLE_AGENT.
 *
 * @param {object} req - Callback parameter request.
 * @param {object} res - Callback parameter response.
 * @returns {Promise<void>} - Return Promise
 */

exports.deleteAllPeepsForOwner = (req, res) => {

    // if ownerId = 0 then user is owner
    if (req.ownerId === 0) {
        console.log("key " + req.userId);
        key = req.userId;
    } else {
        key = req.ownerId;
        console.log("key " + req.ownerId);
    }

    Peep.destroy({
        where: {userKey: key},
        truncate: false
    })
        .then(nums => {
            res.status(200).send({ message: `${nums} Peeps were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "An error occurred while truncating peeps!"
            });
        });
}

