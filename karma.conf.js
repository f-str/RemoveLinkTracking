const reporters = ["mocha", "coverage"];
if (process.env.COVERALLS_REPO_TOKEN) {
    reporters.push("coveralls");
}

module.exports = function(config) {
    config.set({
        singleRun: true,
        concurrency: Infinity,
        port: 9876,   // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ["Firefox"],
        frameworks: ["mocha", "chai"],
        reporters,
        coverageReporter: {
            dir: "build/coverage",
            reporters: [
                {
                    type: "lcov",
                    subdir: "lcov"
                },
                {
                    type: "html",
                    subdir(browser) {
                        // normalization process to keep a consistent browser name
                        // across different OS
                        return browser.toLowerCase().split(/[ /-]/)[0];
                    }
                }, {type: "text-summary"}
            ]
        },
        files: [
            "node_modules/sinon/pkg/sinon.js",
            "node_modules/sinon-chrome/bundle/sinon-chrome.min.js",
            "src/keywords.js",
            "src/*.js",
            "test/*.test.js"
        ],
        preprocessors: {"src/*.js": ["coverage"]},
        plugins: [
            "karma-chai",
            "karma-webpack",
            "karma-coveralls",
            "karma-coverage",
            "karma-firefox-launcher",
            "karma-mocha",
            "karma-mocha-reporter"
        ]
    });
};
