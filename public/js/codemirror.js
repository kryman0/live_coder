define(function (require) {
    const CodeMirror = require("codemirror");

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
            mode: cm.getOption("mode")
        };

        if (bodyObj.code == "" || bodyObj.mode === null) {
            codeResElem.className = "error";

            codeResElem.innerText = "Please check that code is written " +
                "and language has been chosen!";

            return;
        }

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
                codeResElem.style.border = "none";

            codeResElem.innerText = data;
        }).catch(err => console.log("Something went wrong:", err));
    }

    document.body.addEventListener("click", (event) => {
        let className = "";

        if (event.target.id === "lang-menu")
            enableOrRemoveDisplay("enable-display");
        else
            enableOrRemoveDisplay("remove-display");           
    });

    
    function enableOrRemoveDisplay(className) {     
        for (let i = 0; i < langMenuElem.children.length; i++) {
            langMenuElem.children[i].className = className;
        }
    }

    function setMode(element, cmInstance, severalInstances) {
        mode = element.target.value;

        //console.log(element);

        if (element.target.tagName !== "OPTION") return;

        pathToMode = "codemirror/mode/" + mode + "/" + mode;

        if (severalInstances) {
            let options = {
                extraKeys: {
                    'Ctrl-Enter': function(cm) {
                        sendCode(cm.getValue());
                    }
                },
                indentUnit: 4,
                lineWrapping: true,
                lineNumbers: true,
                mode: mode
            };
            //console.log(mode);
            
            
            require([
                "codemirror", modePath
            ], function(CodeMirror) {
                CodeMirror.fromTextArea(
                    textareaElem,
                    options
                )
            });        
        } else {
            console.log(cm);
            require([
                cm, pathToMode
            ], function() {
                //console.log(CodeMirror);
                cm.setOption("mode", mode);
            });
        }
    }


    return {
        setMode,
        codeMirror: cm
    }
});
