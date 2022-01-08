import express from "express";
import path from "path";
import fs from "fs";
import childProc from "child_process";
import util from "util";


const app = express();
const port = 5000;

app.use(
    express.json(
        { limit: "500kb" }
    )
);

app.use(express.static("public"));

app.set("views", "./views"); // views directory
app.set("view engine", "pug"); // template engine


app.get("/", (req, res) => {
    res.render("index", { title: "Live Coder" });
});

app.post("/", async (req, res) => {
    //console.log(req.body);
    let stdMsg = "";
    
    // Check file was written and language exists."
    if (await getWrittenFile(req.body) && languageExists(req.body.mode)) {
        let file = createFileName(req.body.mode);
        
        stdMsg = await getOutput(`./temp/${file}`);
        //console.log(file, stdMsg);
    } else {
        stdMsg = "Error, please try again!";
    }

    
    res.send(stdMsg);
});


function languageExists(fileExt) {
    const availableLanguages = [ "php" ];


    return availableLanguages.find((el) => el == fileExt);
}


async function getWrittenFile(body) {
    const filesFolder = "./temp/";
    
    var isFileSaved = false;

    let file = createFileName(body.mode);
    //console.log(filesFolder + file);
    
    try {
        isFileSaved = await fs.promises.writeFile(filesFolder + file, body.code);
        //console.log("try:", isFileSaved);
    } catch (error) {
        //console.log("catch", error);
        isFileSaved = false;
    }


    return isFileSaved === undefined ? true : false;
}


async function getOutput(file) {
    const execFile = util.promisify(childProc.execFile);

    let [ child, stderr ] = [ "", "" ];

    let binary = createCommandsForBinary(file)[0];
    let binaryCmds = createCommandsForBinary(file)[1];

    try {
        child = await execFile(binary, [ binaryCmds.join(","), file ]);
    } catch(error) {
        stderr = error.stderr;
        //console.log(error);
    }
    
    if (stderr) return stderr;

    return child.stdout;
}


function createFileName(file) {
    return "code." + file;
}


function createCommandsForBinary(file) {
    let commands = [];

    if (file.endsWith(".php")) {
        commands.push("php", []);
        commands[1].push("-f");
    }


    return commands;
}


app.listen(port, () => {
    console.log(`App listens on http://localhost:${port}`);
});
