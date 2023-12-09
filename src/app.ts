import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';

const init = process.argv.includes('--init=true');

const app = express();

//require('dotenv').config();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
        name: "virtualyou-session",
        keys: ["COOKIE_SECRET"],
        domain: '.virtualyou.info',
        httpOnly: true,
        sameSite: 'strict'
    })
);

// database
const db = require("./src/models");
const Doc = db.doc;

if (init) {
    db.sequelize.sync({force: true}).then(() => {
        console.log('Drop and Resync Db');
        initial();
    });
} else {
    db.sequelize.sync();
}

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the VirtualYou Legal API." });
});

// routes
require("./src/routes/peep.routes")(app);

function initial() {
    Doc.create({
        name: "Last Will and Testament",
        type: "Google Drive",
        link: "https://drive.google.com/file/d/1RlBpKPUWtAagUz5RjaAFmFLu6PW9F-8o/view?usp=drive_link",
        userKey: 1,
    });

    Doc.create({
        name: "Health Care Directive",
        type: "Google Drive",
        link: "https://drive.google.com/file/d/1jdCdPD23QS2_L9WJqUKGl9A551PfxmSS/view?usp=drive_link",
        userKey: 1,
    });
}

export default app;