define(["codemirror"], function (CodeMirror) {
    var textareaElem = document.getElementById("edit-code");

    let cmOpts = {
        extraKeys: {
            'Ctrl-Enter': function(cm) {
                sendCode(cm.getValue());
            }
        },
        indentUnit: 4,
        lineWrapping: true,
        lineNumbers: true,
    };


    
    return {
        codeMirror: CodeMirror.fromTextArea(textareaElem, cmOpts),

        sendCode: function(text) {
            let codeResElem = document.getElementById("code-result");

            let bodyObj = {
                code: text,
                //mode: codeMirror.getOption("mode")
                mode: "php"
            };

            //console.log(bodyObj);

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
    }

//    function sendCode(text) {
//        let codeResElem = document.getElementById("code-result");
//
//        let bodyObj = {
//            code: text,
//            //mode: codeMirror.getOption("mode")
//            mode: "php"
//        };
//
//        //console.log(bodyObj);
//
//        if (bodyObj.code == "" || bodyObj.mode === null) {
//            codeResElem.className = "error";
//
//            codeResElem.innerText = "Please check that code is written " +
//                "and language has been chosen!";
//
//            return;
//        }
//        
//
//        fetch("http://localhost:5000", {
//            method: "POST",
//            headers: { "Content-Type": "application/json" },
//            //headers: { "Content-Type": "text/plain" },
//            body: JSON.stringify(bodyObj)
//            //body: bodyObj
//        }).then(
//            resp => resp.text()
//        ).then(data => {
//            if (data.startsWith("Error"))
//                codeResElem.className = "error";
//            else
//                codeResElem.style.border = "none";
//
//            codeResElem.innerText = data;
//        }).catch(err => console.log("Something went wrong:", err));
//    }


    function setcmMode(eventElem) {
        //alert("hi");
        let langMenuElem = document.getElementById("lang-menu");
        langMenuElem.addEventListener("click", (event) => {
            console.log(event);
        });

        let className = "";

        if (eventElem.target.tagName !== "LI") {
            className = "enable-display";
        } else {
            className = "remove-display";

            codeMirror.setOption("mode", eventElem.target.innerText);
        }

        for (let i = 0; i < langMenuElem.children.length; i++) {
            langMenuElem.children[i].className = className;
        }

        console.log(eventElem);
    }

setcmMode("");
    
//    return {
//        setcmMode: function() {
//        },   
//    }
});
