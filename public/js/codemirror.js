define(["codemirror"], function(cm) {
    let options = {
        extraKeys: {
            'Ctrl-Enter': function(cm) {
                sendCode(cm.getValue());
            }
        },
        indentUnit: 4,
        lineWrapping: true,
        lineNumbers: true,
    };

    var codeMirror = CodeMirror.fromTextArea(textareaElem, cmOpts);
});
