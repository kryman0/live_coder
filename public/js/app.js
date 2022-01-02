requirejs.config({
    baseUrl: "lib",
    paths: {
        app: "../js",
    },
    packages: [
        {
            name: "codemirror",
            location: "codemirror",
            main: "lib/codemirror",
        }
    ],
});

requirejs(["app/main"]);
