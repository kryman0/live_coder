import express from "express";
import fs from "fs";
import childProc from "child_process";
import util from "util";


const app = express();
const port = 5000;


app.use(express.text(
    { limit: "500kb" }
));


app.post("/", async (req, res) => {
    //console.log(req.body);

    fs.writeFile("./test.php", req.body, (err) => {
        if (err) {
            res.send("Something went wrong");
        }
    });

//    const child = childProc.execFile("php", [ "-f", "./test.php" ], (err, stdout, stderr) => {
//        if (err || stderr) console.log("error exec file", err, stderr);
//       
//        //res.send(stdout);
//    });
    
    
    const child = await getOutput("./test.php");

    //console.log(child.on("data", (data) => data));
    console.log(child);

    res.send("it works");
});


async function getOutput(file) {
//    const execFile = new Promise((res, rej) => {
//        return childProc.execFile;
//    });
//
//    const promise = await new Promise((res, rej) => {
//        res(childProc.execFile("php", [ "-f", file ]));
//    });
//
    const execFile = util.promisify(childProc.execFile);

    const { stdout } = await execFile("php", [ "-f", file ]);
//    const data = await stdout.on("data", (data) => {
//        //console.log(data);
//
//        return data;
//    });

    //console.log(data);

    //const { stdout } = await execFile("php", [ "-f", file ]);

    //console.log(stdout);

    //console.log(child);

    return stdout;
}


app.listen(port, () => {
    console.log(`App listens on http://localhost:${port}`);
});
