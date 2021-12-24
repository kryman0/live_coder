import express from "express";

import fs from "fs";

const app = express();

const port = 5000;


app.get("/", (req, res) => {
    fs.writeFile("./test.php", req.query, (err) => {
        if (err) {
            console.log("Something went wrong");
        }

        // execute file with "php -f <file>"
    });

    res.send("it works");
});


function saveFile()

app.listen(port, () => {
    console.log(`App listens on http://localhost:${port}`);
});
