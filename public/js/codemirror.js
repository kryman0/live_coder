define(function (require) {
    function option(cm) {
        cm.setOption("lineNumbers", false);
    }

    let defaultOptions = {
        extraKeys: {
            'Ctrl-Enter': function(cm) {
                sendCode(cm.getValue());
            }
        },
        indentUnit: 4,
        lineWrapping: true,
        lineNumbers: true,
        mode: "javascript"
    };

    let CodeMirror = require("codemirror");

    var cm = CodeMirror.fromTextArea(
        document.getElementById("edit-code"),
        defaultOptions
    );

    function setMode(mode, cmInstance, severalInstances) {
        modePath = "codemirror/mode/" + mode + "/" + mode;

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
                    document.getElementById("edit-code"),
                    options
                )
            });        
        } else {
            //console.log(cmInstance);
            require([
                cmInstance, modePath
            ], function() {
                //console.log(cmInstance, "cm:", cm);
                cmInstance.codeMirror.setOption("mode", mode);
            });

            //return cmInstance;
        }
    }


    return {
        setMode,
        codeMirror: cm
    }
});

// create several instances of editors simultaneously.
// make changing options to users available.
