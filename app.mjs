import express from "express";
import fs from "fs";
import childProc from "child_process";

const app = express();
const port = 5000;


app.use(express.text(
    { limit: "500kb" }
));


app.post("/", (req, res) => {
    //console.log(req.body);

    fs.writeFile("./test.php", req.body, (err) => {
        if (err) {
            res.send("Something went wrong");
        }
    });

    const child = childProc.execFile("php", [ "-f", "./test.php" ], (err, stdout, stderr) => {
        if (err || stderr) console.log("error exec file", err, stderr);
       
        //res.send(stdout);
    });

    res.send(child.stdout.on("data", (chunk) => { return chunk; }));
});


//function saveFile()

app.listen(port, () => {
    console.log(`App listens on http://localhost:${port}`);
});
