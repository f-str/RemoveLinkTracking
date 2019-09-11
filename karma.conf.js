module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: ['src/*.js', 'test/*.js'],
    reporters: ['progress'],
    port: 9876,   // karma web server port
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['FirefoxHeadless'],
    client: {
      mocha: {
        reporter: 'html',
      },
    },
    singleRun: true,
    concurrency: Infinity,
  })
};
