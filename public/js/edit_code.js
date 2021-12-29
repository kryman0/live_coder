var textareaElem = document.getElementById("edit-code");

let cmOpts = {
    extraKeys: {
        'Ctrl-Enter': function(cm) {
            sendCode(cm.getValue());
        }
    }
};

var codeMirror = CodeMirror.fromTextArea(textareaElem, cmOpts);

function sendCode(text) {
    let codeResElem = document.getElementById("code-result");
    //console.log("from function:", text);

    fetch("http://localhost:5000", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: text
    }).then(
        resp => resp.text()
    ).then(data => {
        codeResElem.innerText = data;
    }).catch(err => console.log("Something went wrong:", err));
}
