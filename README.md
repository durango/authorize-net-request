# Authorize.net Request

[![Dependency Status](https://david-dm.org/durango/authorize-net-request.svg?theme=shields.io)](https://david-dm.org/durango/authorize-net-request) [![devDependency Status](https://david-dm.org/durango/authorize-net-request/dev-status.svg?theme=shields.io)](https://david-dm.org/durango/authorize-net-request#info=devDependencies)

## Install

    npm install auth-net-request

## Usage

```js
var AuthorizeRequest = require('auth-net-request');

var Request = new AuthorizeRequest({
  api: '123',
  key: '1234',
  cert: '/path/to/cert.pem',
  rejectUnauthorized: false, // true
  requestCert: true, // false
  agent: false // http.agent object
  sandbox: false // true
});

Request.send(<method>, <xml>, [xmlOptions], function(err, response) {});
```
