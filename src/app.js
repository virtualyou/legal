"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var cookie_session_1 = require("cookie-session");
var init = process.argv.includes('--init=true');
var app = (0, express_1.default)();
require('dotenv').config();
app.use((0, cors_1.default)());
// parse requests of content-type - application/json
app.use(express_1.default.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_session_1.default)({
    name: "virtualyou-session",
    keys: ["COOKIE_SECRET"],
    domain: '.virtualyou.info',
    httpOnly: true,
    sameSite: 'strict'
}));
// database
var db = require("./app/models");
var Peep = db.peep;
if (init) {
    db.sequelize.sync({ force: true }).then(function () {
        console.log('Drop and Resync Db');
        initial();
    });
}
else {
    db.sequelize.sync();
}
app.get("/", function (req, res) {
    res.json({ message: "Welcome to the VirtualYou Personal API." });
});
// routes
require("./app/routes/peep.routes")(app);
function initial() {
    Peep.create({
        name: "David Knoxville",
        userKey: 10,
        phone1: "919-888-3000",
        phone2: "",
        email: "me@dlwhitehurst.com",
        address: "123 Anywhere Ln, Sampleville, ND, 23045",
        note: "Insurance Agent"
    });
    Peep.create({
        name: "Patty Brown",
        userKey: 10,
        phone1: "722-310-1288",
        phone2: "",
        email: "pbrown@schwartz.com",
        address: "4922 Clamstrip St, Middlebury, CT, 29300",
        note: "Good friend"
    });
    Peep.create({
        name: "Nancy Reynolds",
        userKey: 13,
        phone1: "800-825-9274",
        phone2: "",
        email: "nrey@acme.com",
        address: "",
        note: "Nurse"
    });
    Peep.create({
        name: "Peggy Smith",
        userKey: 13,
        phone1: "892-123-7702",
        phone2: "",
        email: "psmith@yahoo.com",
        address: "3456 Jaybird Ct, Gloucester Pt. VA, 23062",
        note: "Mother in Law"
    });
    Peep.create({
        name: "Robert Sandberg",
        userKey: 13,
        phone1: "877-655-2309",
        phone2: "",
        email: "rsandberg@gmail.com",
        address: "",
        note: "Jeweler"
    });
}
