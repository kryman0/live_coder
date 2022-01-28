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
    console.log(req.body);
    let stdMsg = "";
    
    // Check file was written and language exists."
    if (await getWrittenFile(req.body) && languageExists(req.body.mode)) {
        let file = createFileName(req.body.mode);
        
        //console.log("from post:", file, req.body);

        stdMsg = await getOutput(`./temp/${file}`);

        //console.log("from post:", file, stdMsg);
    } else {
        stdMsg = "Error, please try again!";
    }

    //console.log(stdMsg);

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
    const availableLanguages = [ "cs", "js", "php", "py" ];


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
        isFileSaved = await fs.promises.writeFile(
            filesFolder + file, 
            body.code
        );
    } catch (error) {
        console.log("Could not write file to disk:", error);
        isFileSaved = false;
    }

    //console.log(isFileSaved);

    return typeof isFileSaved === "undefined" ? true : false;
}


/*
* @function
* Gets output from executed binary.
* 
* @param   {string} file - Name of file.
* @returns {string} - Child process' stdout message.
*/
async function getOutput(file) {
    //console.log(file);

    const exec = util.promisify(childProc.exec);

    var [ child, stderr ] = [ "", "" ];

    let binary = createCommandsForBinary(file);
    //let binaryOpts = createCommandsForBinary(file)[1];
    
    console.log("binary:", binary);

    try {        
        child = await exec(
            binary[0],
            binary[1]
        );

        //console.log("inside try", child);
    } catch(error) {
        stderr = error.stderr;
        
        console.log("Can't execute binary:", error);
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
function createFileName(fileExt) {
    //console.log("file:", fileExt);

    let fileName = "code.";

    switch (fileExt) {
        case "cs":
            fileName = "c_sharp/Program.cs";
            break;
        default:
            fileName += fileExt;
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
    var commands = [];
    
    let fileExt = file.substring(file.lastIndexOf("."));

    //console.log(file, fileExt);

    switch (fileExt) {
        case ".php":
            commands.push("php -f " + file);
            break;
        case ".py":
            commands.push("python3.7 " + file);
            break;
        case ".js":
            commands.push("node " + file);
            break;
        case ".cs":
            let path = "./temp/c_sharp";

            commands.push(
                'dotnet run --project ' + path,
                {}
            );
            break;
    }

    //console.log(commands);


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
