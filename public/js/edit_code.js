var textareaElem = document.getElementById("edit-code");

document.addEventListener("keydown", (target) => {
    if (target.ctrlKey && target.key == "Enter") {
        sendCode(target.target.value);
        //console.log(target.target.value);
    }
});

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

//async function getCode() {}
