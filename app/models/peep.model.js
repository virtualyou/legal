
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

module.exports = (sequelize, Sequelize) => {
    return sequelize.define("peeps", {
        name: {
            type: Sequelize.STRING
        },
        phone1: {
            type: Sequelize.STRING
        },
        phone2: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        note: {
            type: Sequelize.STRING
        },
        userKey: {
            type: Sequelize.INTEGER
        }
    });
};
/*
    "name": "Bob Taylor",
    "email": "btaylor79@gmail.com",
    "phone1": "919-567-5499",
    "phone2": "456-122-8000",
    "address": "7823 Waters Lane, Miami, Florida, 23499",
    "note": "Close friend",
    "userKey": 10
 */