
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

const { authJwt } = require("../utility");
const controller = require("../controllers/peep.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

/*
 * ************************************************************************
 * ADMIN ONLY
 * ************************************************************************
 */
    // GET - all peeps
    app.get(
        "/personal/v1/peeps",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getAllPeeps
    );

    // GET - a peep by id
    app.get(
        "/personal/v1/peeps/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.getPeep
    );

    // PUT - update a peep by id
    app.put(
        "/personal/v1/peeps/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.updatePeep
    );

    // DELETE - a peep by id
    app.delete(
        "/personal/v1/peeps/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deletePeep
    );

    // DELETE - all peeps
    app.delete(
        "/personal/v1/peeps",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAllPeeps
    );

    /*
     * ************************************************************************
     * OWNER, AGENT, (MONITOR?) USER
     * ************************************************************************
     */

    // GET - all peeps for owner
    app.get(
        "/personal/v1/owner/peeps",
        [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
        controller.getAllPeepsForOwner
    );

    // GET - peep by id for owner only
    app.get(
        "/personal/v1/owner/peeps/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgentOrMonitor],
        controller.getPeepForOwner
    );

    // POST - create a new Peep for owner (owner or agent cognizant of userKey)
    app.post(
        "/personal/v1/owner/peeps",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.createPeepForOwner
    );

    // PUT - update a peep for owner only
    app.put(
        "/personal/v1/owner/peeps/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.updatePeepForOwner
    );

    // DELETE - delete a peep by id for owner only
    app.delete(
        "/personal/v1/owner/peeps/:id",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.deletePeepForOwner
    );

    // DELETE - all peeps for owner only
    app.delete(
        "/personal/v1/owner/peeps",
        [authJwt.verifyToken, authJwt.isOwnerOrAgent],
        controller.deleteAllPeepsForOwner
    );

};

