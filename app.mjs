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


/*
* @function
* Check that language exists to parse the code.
*
* @param {string} fileExt - Extension of the file.
* @returns {(string | undefined)}
*/
function languageExists(fileExt) {
    //console.log(fileExt);
    const availableLanguages = [ "php", "python" ];


    return availableLanguages.find((el) => el == fileExt);
}


/*
* @function 
* Writes filename to disk. 
* 
* @param {object} body - Request's body.
* @returns {boolean} - True for successful writing filename to disk,
* or false if failure.
*/
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


    return typeof isFileSaved === "undefined" ? true : false;
}


/*
* @function
* Get's output from executed binary.
* 
* @param   {string} file - Name of file.
* @returns {string} - Child process' stdout message.
*/
async function getOutput(file) {
    const execFile = util.promisify(childProc.execFile);

    let [ child, stderr ] = [ "", "" ];

    let binary = createCommandsForBinary(file)[0];
    let binaryCmds = createCommandsForBinary(file)[1];
    
    //console.log(binary, binaryCmds);

    try {
        child = await execFile(binary, 
            binaryCmds.length > 0 ? [ binaryCmds.join(","), file ] : [ file ]
        );
    } catch(error) {
        stderr = error.stderr;
        //console.log(error);
    }
    
    if (stderr) return stderr;

    return child.stdout;
}


/*
* @function
* Creates the correct filename for binary to execute.
* 
* @param   {string} file - Name of programming language.
* @returns {string} - Correct name of file to be executed where the file
* has been saved.
*/
function createFileName(file) {
    //console.log("file:", file);

    let fileName = "code.";

    if (file.startsWith("python")) {
        fileName += "py";
    } else {
        fileName += file;
    }

    //console.log("filename", fileName);


    return fileName;
}

/*
* @function
* Use correct binary to be executed with eventual arguments.
*
* @param   {string} file - Correct file extension of the programming language.
* @returns {Array} - The binary with its eventual arguments.
*/
function createCommandsForBinary(file) {
    let commands = [];

    if (file.endsWith(".php")) {
        commands.push("php", []);
        commands[1].push("-f");
    } else if (file.endsWith(".py")) {
        commands.push("python3.7", []);
    }


    return commands;
}


/*
* @function
* Prints to the console the port number the application listens to.
* 
* @param {number} port - Port number.
*/
app.listen(port, () => {
    console.log(`App listens on http://localhost:${port}`);
});
