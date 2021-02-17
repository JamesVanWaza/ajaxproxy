const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// proxy middleware options
const filter = function(pathname, req) {
    return true;
};

// proxy middleware options
const options = {
    target: 'https://developer.nps.gov', // target host
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
    pathRewrite: {
        '^/nps/': '/', // rewrite path
    },
    onProxyReq: (proxyReq) => {
        // append key-value pair for API key to end of path
        // using KEYNAME provided by web service
        // and KEYVALUE stored in Heroku environment variable
        proxyReq.path += ('&api_key=' + process.env.NPS_APIKEY);
    },
    logLevel: 'debug' // verbose server logging
};

// create the proxy (without context)
const exampleProxy = createProxyMiddleware(options);

// mount `exampleProxy` in web server
const app = express();
app.use('/nps', exampleProxy);
app.listen(3000);