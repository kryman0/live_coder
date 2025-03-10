define(function (require) {
    const CodeMirror = require("codemirror");

    const clike_mode = require("./clike_mode");

    var textareaElem = document.getElementById("edit-code");

    var langMenuElem = document.getElementById("lang-menu");

    langMenuElem.addEventListener("click", (event) => {
        setMode(event);
    });

    let defaultOptions = {
        extraKeys: {
            'Ctrl-Enter': function(cm) {
                sendCode(cm.getValue());
            }
        },
        indentUnit: 4,
        lineWrapping: true,
        lineNumbers: true,
        mode: typeof mode === "undefined" ? null : mode,
    };

    var cm = CodeMirror.fromTextArea(
        textareaElem,
        defaultOptions
    );


    function sendCode(text) {
        //console.log(cm.getOption("mode"));

        let codeResElem = document.getElementById("code-result");

        let bodyObj = {
            code: text,
            mode: convertToRightFileExt(cm.getOption("mode"))
        };

        if (bodyObj.code == "" || bodyObj.mode === null) {
            codeResElem.className = "error";

            codeResElem.innerText = "Please check that code is written " +
                "and language has been chosen!";

            return;
        }

        //console.log(bodyObj);

        fetch("http://localhost:5000", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            //headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(bodyObj)
            //body: bodyObj
        }).then(
            resp => resp.text()
        ).then(data => {
            if (data.startsWith("Error"))
                codeResElem.className = "error";
            else
                codeResElem.className = "";

            //console.log(data);

            codeResElem.innerText = data;
        }).catch(err => {
            codeResElem.className = "error";
            codeResElem.innerText = `Something went wrong:\n${err}`;
        });
    }


    function convertToRightModeToCM(value) {
        let mode = value;

        switch (mode) {
            case "js":
                mode = "javascript";
                break;
            case "py":
                mode = "python";
                break;
            case "cs":
                mode = "clike";
                break;
        }
        

        return mode;
    }

    function convertToRightFileExt(mode) {
        //console.log(mode);

        switch (mode.name) {
            case "javascript":
                mode = "js";
                break;
            case "python":
                mode = "py";
                break;
            case "clike":
                mode = "cs";
                break;
            case "php":
                mode = "php";
        }
        
        //console.log(mode);


        return mode;
    }

    function setMode(element, cmInstance, severalInstances) {
        let mode = convertToRightModeToCM(element.target.value);

        //console.log(mode);

        if (element.target.value === "language") return;

        pathToMode = "codemirror/mode/" + mode + "/" + mode;

        if (severalInstances) { // this is not done
            //let options = {
            //    extraKeys: {
            //        'Ctrl-Enter': function(cm) {
            //            sendCode(cm.getValue());
            //        }
            //    },
            //    indentUnit: 4,
            //    lineWrapping: true,
            //    lineNumbers: true,
            //    mode: mode
            //};
            ////console.log(mode);
            
            
            require([
                "codemirror", pathToMode
            ], function(CodeMirror) {
                CodeMirror.fromTextArea(
                    textareaElem,
                    defaultOptions
                )
            });        
        } else {
            //console.log(cm);
            require([
                pathToMode
            ], function() {
                //console.log(CodeMirror);
                if (mode === "clike") {
                    cm.setOption("mode", {
                        name: mode,
                        keywords: clike_mode.keywords
                    });
                } else {
                    cm.setOption("mode", {
                        name: mode
                    });
                }
            });
        }
    }

    
    return {
        setMode,
        codeMirror: cm
    }
});
