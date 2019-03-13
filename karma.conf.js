module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: ['src/remover.js', 'test/*.js'],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless', 'FirefoxHeadless'],
    client: {
      mocha: {
        reporter: 'html',
      },
    },
    singleRun: true,
    concurrency: Infinity,
  })
};
