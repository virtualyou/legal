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
 * doc.model.ts
 */

//module.exports = (sequelize: {
const doc = (sequelize: {
    define: (arg0: string, arg1: {
        name: { type: any; };
        type: { type: any; };
        link: { type: any; };
        userKey: { type: any; };
    }) => any;
}, Sequelize: { STRING: any; INTEGER: any; }) => {
    return sequelize.define("docs", {
        name: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        link: {
            type: Sequelize.STRING
        },
        userKey: {
            type: Sequelize.INTEGER
        }
    });
};

export default doc;