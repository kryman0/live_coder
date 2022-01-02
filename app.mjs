import express from "express";
import path from "path";
import fs from "fs";
import childProc from "child_process";
import util from "util";
import requirejs from "requirejs";
import { createRequire } from "module";

//const require = createRequire(import.meta.url);

//requirejs.config({
//    baseUrl: path.dirname(import.meta.url),
//    //nodeRequire: require,
//    paths: {
//        main: "public/js/main",
//    },
//    //packages: [
//    //    {
//    //        name: "codemirror",
//    //        location: "node_modules/codemirror",
//    //        main: "lib/codemirror",
//    //    }
//    //],
//});

//requirejs("main");


const app = express();
const port = 5000;

app.use(
    express.json(
        { limit: "500kb" }
    )
);

//app.use(express.static("views"));
app.use(express.static("public"));

//app.use(
//    express.text(
//        { limit: "500kb" }
//    )
//);

app.set("views", "./views"); // views directory
app.set("view engine", "pug"); // template engine


app.get("/", (req, res) => {
    res.render("index", { title: "welcome!" });
});

app.post("/", async (req, res) => {
    //console.log(req.body);
    let stdMsg = "";
    
    // Check file was written and language exists."
    if (await getWrittenFile(req.body) && getRightFile(req.body.mode)) {
        let file = createFileName(req.body.mode);
        
        stdMsg = await getOutput(`./temp/${file}`);
        //console.log(file, stdMsg);
    } else {
        stdMsg = "Error, please try again!";
    }

    
    res.send(stdMsg);
});


function getRightFile(fileExt) {
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

    
    //console.log("function", isFileSaved);

    return isFileSaved === undefined ? true : false;
}


async function getOutput(file) {
    const execFile = util.promisify(childProc.execFile);

    let [ child, stderr ] = [ "", "" ];

    try {
        child = await execFile("php", [ "-f", file ]); // ändra efter filändelse för rätt program
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


app.listen(port, () => {
    console.log(`App listens on http://localhost:${port}`);
});
