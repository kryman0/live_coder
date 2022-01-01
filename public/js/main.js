alert("from main")

//requirejs(["edit_code"], function(edit_code));

requirejs.config({
    baseUrl: "./js",
    //paths: "/js",
    packages: [
        {
            name: "codemirror",
            location: "../codemirror",
            main: "lib/codemirror",
        }
    ],
});
//
//requirejs(["codemirror"], function(codemirror));
//
////console.log(requirejs);
